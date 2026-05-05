import { execFile } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { JSDOM } from 'jsdom';

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const mmdcBin = path.join(rootDir, 'node_modules', '.bin', 'mmdc');

const themes = {
  light: {
    theme: 'default',
    themeVariables: {
      primaryColor: '#c2410c',
      primaryTextColor: '#fafafa',
      primaryBorderColor: '#c2410c',
      lineColor: '#525252',
      secondaryColor: '#f3f3f3',
      tertiaryColor: '#fbe9dc',
      background: '#fafafa',
      mainBkg: '#ffffff',
      nodeBorder: '#e5e5e5',
      clusterBkg: '#f3f3f3',
      titleColor: '#0a0a0a',
      edgeLabelBackground: '#f5f5f5',
    },
  },
  dark: {
    theme: 'dark',
    themeVariables: {
      primaryColor: '#fb923c',
      primaryTextColor: '#0f0f0f',
      primaryBorderColor: '#fb923c',
      lineColor: '#a3a3a3',
      secondaryColor: '#171717',
      tertiaryColor: '#1c1c1c',
      background: '#0f0f0f',
      mainBkg: '#171717',
      nodeBorder: '#262626',
      clusterBkg: '#171717',
      titleColor: '#f5f5f5',
      edgeLabelBackground: '#1c1c1c',
    },
  },
};

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith('.html')) return [fullPath];
    return [];
  }));
  return files.flat();
}

function stripXmlDeclaration(svg) {
  return svg
    .replace(/^<\?xml[^>]*>\s*/i, '')
    .replace(/^<!DOCTYPE[^>]*>\s*/i, '')
    .trim();
}

async function renderDiagram(source, id, tempDir) {
  const inputPath = path.join(tempDir, `${id}.mmd`);
  await writeFile(inputPath, source, 'utf8');

  const output = {};
  for (const [name, config] of Object.entries(themes)) {
    const configPath = path.join(tempDir, `${id}-${name}.json`);
    const outputPath = path.join(tempDir, `${id}-${name}.svg`);
    await writeFile(configPath, JSON.stringify({
      theme: config.theme,
      fontFamily: 'Geist, system-ui, sans-serif',
      themeVariables: config.themeVariables,
    }), 'utf8');

    await execFileAsync(mmdcBin, [
      '--quiet',
      '--input', inputPath,
      '--output', outputPath,
      '--backgroundColor', 'transparent',
      '--configFile', configPath,
      '--svgId', `${id}-${name}`,
    ], { maxBuffer: 1024 * 1024 * 8 });

    output[name] = stripXmlDeclaration(await readFile(outputPath, 'utf8'));
  }

  return output;
}

function replaceDiagram(block, source, rendered) {
  block.textContent = '';
  block.setAttribute('data-mermaid-rendered', 'true');

  const light = block.ownerDocument.createElement('div');
  light.className = 'mermaid-svg mermaid-svg-light';
  light.innerHTML = rendered.light;

  const dark = block.ownerDocument.createElement('div');
  dark.className = 'mermaid-svg mermaid-svg-dark';
  dark.innerHTML = rendered.dark;

  block.append(light, dark);
}

const htmlFiles = await findHtmlFiles(publicDir);
const tempDir = await mkdtemp(path.join(tmpdir(), 'revaulter-mermaid-'));
let count = 0;

try {
  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, 'utf8');
    if (!html.includes('class="mermaid"') && !html.includes('class=mermaid')) continue;

    const dom = new JSDOM(html);
    const blocks = [...dom.window.document.querySelectorAll('.mermaid-block')];
    let changed = false;

    for (const block of blocks) {
      const pre = block.querySelector('pre.mermaid');
      if (!pre) continue;

      count += 1;
      const id = `mermaid-${count}`;
      const source = pre.textContent.trim();
      const rendered = await renderDiagram(source, id, tempDir);
      replaceDiagram(block, source, rendered);
      changed = true;
    }

    if (changed) {
      await writeFile(htmlFile, dom.serialize(), 'utf8');
    }
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}

console.log(`Rendered ${count} Mermaid diagram${count === 1 ? '' : 's'} to static SVG.`);
