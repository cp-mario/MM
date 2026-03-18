import { PATTERNS } from "./patterns.js";

// ============================================================================
// PARSER PRINCIPAL
// ============================================================================
export function mmxToHtml(mmx) {
  let result = mmx;
  for (const { regex, replace } of PATTERNS.monoline) {
    result = result.replace(regex, replace);
  }
  for (const block of PATTERNS.multiline) {
    result = parseMultilineBlocks(result, block);
  }
  result = wrapParagraphs(result);
  for (const { regex, replace } of PATTERNS.inline) {
    result = result.replace(regex, replace);
  }
  return result.replace(/(<\/?(?:h[1-6]|div|p|ul|ol|li|blockquote)[^>]*>)\s*<br>\s*/gi, '$1');
}

function parseMultilineBlocks(text, config) {
  const lines = text.split('\n');
  const output = [];
  const stack = [];
  for (const line of lines) {
    if (config.open.test(line)) {
      config.open.lastIndex = 0;
      stack.push({ type: config.name, content: [], tag: config.tag, class: config.class });
    } else if (config.close.test(line) && stack.length > 0) {
      config.close.lastIndex = 0;
      const block = stack.pop();
      let processed = wrapParagraphs(block.content.join('\n'));
      for (const { regex, replace } of PATTERNS.inline) {
        processed = processed.replace(regex, replace);
      }
      const html = `<${block.tag} class="${block.class}"><span class="note-label">Note:</span>${processed}</${block.tag}>`;
      if (stack.length > 0) {
        stack[stack.length - 1].content.push(html);
      } else {
        output.push(html);
      }
    } else if (stack.length > 0) {
      stack[stack.length - 1].content.push(line);
    } else {
      output.push(line);
    }
  }
  return output.join('\n');
}

function wrapParagraphs(text) {
  const lines = text.split('\n');
  const output = [];
  let paragraph = [];
  const blockRegex = /^<(?:h[1-6]|div|p|ul|ol|li|blockquote|hr|img|pre|code)/i;
  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const content = paragraph.join('<br>');
    output.push(`<p>${content}</p>`);
    paragraph = [];
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '%%HARD_BREAK%%') {
      flushParagraph();
      output.push('<br>');
      continue;
    }
    if (trimmed === '') continue;
    if (blockRegex.test(trimmed)) {
      flushParagraph();
      output.push(line);
      continue;
    }
    paragraph.push(trimmed);
  }
  flushParagraph();
  return output.join('\n');
}