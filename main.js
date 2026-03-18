//imports =========================================
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { mmToHtml } from "./scripts/parser.js";
//=================================================

//Importante

const CONFIG = {
  deleteOriginals: false,
  verbose: true,


  //Canviar esto

  sidebar: true, //documentacion entera (true) o solo un documento (false)

  project: {
    source: "./1test/tusProyectos/docsEnteras/proyecto1",  //carpeta (mas info en el readme.md)
    output: "./1test/output/docsEnteras/proyecto1"   //carpeta (mas info en el readme.md)
  },

  single: {
    input: "./1test/tusProyectos/archivosUnicos/pruebaUnica.mm", //archivo.mm
    output: "./1test/output/archivosUnicos/pruebaUnica.html"  //archivo que se generara
  }
};

//===========================================



// ============================================================================
// GENERADOR DE INDEX.JSON
// ============================================================================
function generateIndexRecursive(sourceDir, rootDir) {
  const items = fs.readdirSync(sourceDir);
  const result = [];

  for (const item of items) {
    const fullPath = path.join(sourceDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      result.push({
        type: "folder",
        name: item,
        path: path.relative(rootDir, fullPath),
        children: generateIndexRecursive(fullPath, rootDir)
      });
    } else if (item.endsWith(".html")) {
      result.push({
        type: "file",
        name: item.replace(".html", ""),
        path: path.relative(rootDir, fullPath)
      });
    }
  }

  return result;
}

// ============================================================================
// FUNCIONES DE PROCESAMIENTO DE PROYECTO
// ============================================================================
function processProjectStructure(sourceDir, outputDir, options = {}) {
  const { deleteOriginals = false, verbose = true } = options;
  const log = (msg) => verbose && console.log(msg);

  log(`\nProcesando proyecto: ${sourceDir}`);
  log(`Output: ${outputDir}\n`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const stats = { processed: 0, errors: 0, copied: 0 };

  // Copiar assetsInternos
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const assetsInternosSource = path.join(__dirname, "assetsInternos");

  if (fs.existsSync(assetsInternosSource)) {
    const assetsInternosDest = path.join(outputDir, "assetsInternos");
    copyDirectoryRecursive(assetsInternosSource, assetsInternosDest);
    log(`assetsInternos/ copiado`);
  }

  // Copiar config.json
  const configSource = path.join(sourceDir, 'config.json');
  if (fs.existsSync(configSource)) {
    fs.copyFileSync(configSource, path.join(outputDir, 'config.json'));
    log(`config.json copiado`);
  }

  // Copiar assets/
  const assetsSource = path.join(sourceDir, 'assets');
  if (fs.existsSync(assetsSource)) {
    copyDirectoryRecursive(assetsSource, path.join(outputDir, 'assets'));
    log(`assets/ copiado`);
  }

  // Procesar pages/
  const pagesSource = path.join(sourceDir, 'pages');
  const pagesDest = path.join(outputDir, 'pages');
  if (!fs.existsSync(pagesDest)) fs.mkdirSync(pagesDest, { recursive: true });

  processPagesRecursive(pagesSource, pagesDest, stats, { deleteOriginals, log });
  //Procesar index.mm en la raíz del proyecto
  const rootIndexMm = path.join(sourceDir, "index.mm");
  if (fs.existsSync(rootIndexMm)) {
    const rootIndexHtml = path.join(outputDir, "index.html");
    log(`index.mm → index.html`);
    convertMmFile(rootIndexMm, rootIndexHtml);
    stats.processed++;
  }


  //GENERAR INDEX.JSON
  const indexData = generateIndexRecursive(pagesDest, pagesDest);
  const indexPath = path.join(outputDir, "assetsInternos", "index.json");
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), "utf8");
  log(`Generado índice: assetsInternos/index.json`);

  // Resumen
  log(`\nResumen:`);
  log(`Convertidos: ${stats.processed}`);
  log(`Copiados: ${stats.copied}`);
  log(`Errores: ${stats.errors}`);
  log(`Proceso completado\n`);
}

function copyDirectoryRecursive(source, destination) {
  if (!fs.existsSync(destination)) fs.mkdirSync(destination, { recursive: true });
  const items = fs.readdirSync(source);
  for (const item of items) {
    const srcPath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function processPagesRecursive(sourceDir, outputDir, stats, options) {
  const { deleteOriginals, log } = options;
  const items = fs.readdirSync(sourceDir);

  for (const item of items) {
    const srcPath = path.join(sourceDir, item);
    const destPath = path.join(outputDir, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      processPagesRecursive(srcPath, destPath, stats, options);

    } else if (item.endsWith('.mm')) {
      try {
        const htmlName = item.replace('.mm', '.html');
        const htmlDest = path.join(outputDir, htmlName);

        log(`${item} → ${htmlName}`);
        convertMmFile(srcPath, htmlDest);
        stats.processed++;

        if (deleteOriginals) fs.unlinkSync(srcPath);
      } catch (error) {
        console.error(`  ❌ Error en ${item}:`, error.message);
        stats.errors++;
      }

    } else {
      fs.copyFileSync(srcPath, destPath);
      stats.copied++;
    }
  }
}

const scriptContent = `
  const path = window.location.pathname;
  const parts = path.split("/").filter(p => p.length > 0);
  const rootIndex = parts.indexOf("pages");
  const depth = rootIndex === -1 ? 0 : parts.length - (rootIndex + 1);
  const prefix = "../".repeat(depth);

  const script = document.createElement("script");
  script.src = prefix + "assetsInternos/script.js";
  document.body.appendChild(script);
`;

function convertMmFile(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, "utf8");
  const template = fs.readFileSync("./template.html", "utf8");
  const htmlContent = mmToHtml(content);

  const titleMatch = content.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : "Documentación";

  const finalTemplate = template
    .replaceAll("{{title}}", title)
    .replaceAll("{{content}}", htmlContent)
    .replaceAll("{{script}}", scriptContent);

  fs.writeFileSync(outputPath, finalTemplate, "utf8");
}




//vaciar la carpeta del output antes de generarlo
if (CONFIG.sidebar){
  const dir = CONFIG.project.output
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}











function main() {
  if (CONFIG.sidebar) {
    const { source, output } = CONFIG.project;
    if (!fs.existsSync(source)) {
      console.error(`❌ Carpeta de origen no existe: ${source}`);
      process.exit(1);
    }
    processProjectStructure(source, output, {
      deleteOriginals: CONFIG.deleteOriginals,
      verbose: CONFIG.verbose
    });

  } else {
    const { input, output } = CONFIG.single;
    try {
      const content = fs.readFileSync(input, "utf8");
      const template = fs.readFileSync("./template.html", "utf8");
      const htmlContent = mmToHtml(content);

      const titleMatch = content.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : "Documentación";

      const finalTemplate = template
        .replaceAll("{{title}}", title)
        .replaceAll("{{content}}", htmlContent)
        .replaceAll("{{script}}", scriptContent);

      const dir = path.dirname(output);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(output, finalTemplate, "utf8");
      console.log(`Generado: ${output}`);

    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  }
}

main();
