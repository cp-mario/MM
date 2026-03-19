import { PATTERNS } from "./patterns.js";

// ============================================================================
// PARSER PRINCIPAL
// ============================================================================
export function mmxToHtml(mmx) {
  let result = mmx;

  // 1. Monoline
  for (const { regex, replace } of PATTERNS.monoline) {
    result = result.replace(regex, replace);
  }

  // 2. Multiline
  for (const block of PATTERNS.multiline) {
    result = parseMultilineBlocks(result, block);
  }

  // 3. 🔥 PROTEGER RAW ANTES DE TODO LO DEMÁS
  const extracted = extractRawBlocks(result);
  result = extracted.html;

  // 4. Wrap paragraphs (ya no rompe <pre>)
  result = wrapParagraphs(result);

  // 5. Inline (solo fuera de code)
  for (const { regex, replace } of PATTERNS.inline) {
    result = result.replace(regex, replace);
  }

  // 6. Restaurar code
  result = restoreRawBlocks(result, extracted.blocks);

  // 7. Limpieza final
  return result.replace(/(<\/?(?:h[1-6]|div|p|ul|ol|li|blockquote)[^>]*>)\s*<br>\s*/gi, '$1');
}

// ============================================================================
// MULTILINE
// ============================================================================
function parseMultilineBlocks(text, config) {
  const lines = text.split('\n');
  const output = [];
  const stack = [];

  for (const line of lines) {

    if (config.close.test(line) && stack.length > 0) {
      config.close.lastIndex = 0;

      const block = stack.pop();
      let processed;

      // En parseMultilineBlocks, cuando procesas bloques raw (code):

    if (block.raw) {
        let content = block.content.join('\n');
        content = content.replace(/^\n+/, '').replace(/\n+$/, '')
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");

        let attrs = '';
        if (block.isAuto) attrs = ' data-auto="true"';
        
        // 👇 AÑADIR BOTÓN DE COPIAR
        const copyButton = `<button class="copy-btn" title="Copiar código">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        </button>`;
        
        processed = `<code${attrs}>${content}</code>${copyButton}`;
        
        //AÑADIR CLASE SEGÚN SI TIENE HIGHLIGHT
        const preClass = block.isAuto 
            ? 'multiline-code highlighted' 
            : 'multiline-code plain';
        
        const html = `<pre class="${preClass}">${processed}</pre>`;
    } else {
        processed = wrapParagraphs(block.content.join('\n'));

        for (const { regex, replace } of PATTERNS.inline) {
          processed = processed.replace(regex, replace);
        }

        processed = `<span class="note-label">Note:</span>${processed}`;
      }

      const html = `<${block.tag} class="${block.class}">${processed}</${block.tag}>`;

      if (stack.length > 0) {
        stack[stack.length - 1].content.push(html);
      } else {
        output.push(html);
      }

    } else if (config.open.test(line)) {
        config.open.lastIndex = 0;

        const match = config.open.exec(line);
        config.open.lastIndex = 0
        const lang = match && match[1] ? match[1] : '';
        const isAuto = lang === 'auto';

        stack.push({
          type: config.name,
          content: [],
          tag: config.tag,
          class: config.class,
          raw: config.raw || false,
          lang,       // guardamos el lenguaje
          isAuto      // guardamos si es auto
        });
      } else if (stack.length > 0) {
        stack[stack.length - 1].content.push(line);

    } else {
      output.push(line);
    }
  }

  return output.join('\n');
}

// ============================================================================
// WRAP PARAGRAPHS
// ============================================================================
function wrapParagraphs(text) {
  const lines = text.split('\n');
  const output = [];
  let paragraph = [];

  const blockRegex = /^<(?:h[1-6]|div|p|ul|ol|li|blockquote|hr|img|pre)/i;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const content = paragraph.join('<br>');
    output.push(`<p>${content}</p>`);
    paragraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    //placeholders RAW (no tocar)
    if (/^%%RAW_\d+%%$/.test(trimmed)) {
      flushParagraph();
      output.push(trimmed);
      continue;
    }

    if (trimmed === '%%HARD_BREAK%%') {
      flushParagraph();
      output.push('<br>');
      continue;
    }

    if (trimmed === '') {
      //IMPORTANTE: mantiene separación real entre párrafos
      flushParagraph();
      continue;
    }

    if (blockRegex.test(trimmed)) {
      flushParagraph();
      output.push(line);
      continue;
    }

    paragraph.push(line); // NO usar trimmed → mantiene espacios reales
  }

  flushParagraph();
  return output.join('\n');
}

// ============================================================================
// RAW BLOCK PROTECTION
// ============================================================================
function extractRawBlocks(html) {
  const blocks = [];
  let i = 0;

  html = html.replace(/<pre class="multiline-code">[\s\S]*?<\/pre>/g, (match) => {
    const key = `%%RAW_${i++}%%`;
    blocks.push({ key, value: match });
    return key;
  });

  return { html, blocks };
}

function restoreRawBlocks(html, blocks) {
  for (const b of blocks) {
    html = html.replace(b.key, b.value);
  }
  return html;
}