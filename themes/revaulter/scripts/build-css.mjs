import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const mainPath = join(root, 'assets/css/main.css')
const schemesDir = join(root, 'assets/css/schemes')
const tempDir = join(root, '.tmp')
const outputDir = join(root, 'static/css')

// main.css is shared by every site theme
// The build injects exactly one scheme into a temporary input file so Tailwind emits a complete, tree-shaken bundle per scheme, such as static/css/main-rust.css
const marker = '/* @theme-scheme */'

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
      }
    })
  })
}

const mainCss = await readFile(mainPath, 'utf8')

if (!mainCss.includes(marker)) {
  throw new Error(`Missing ${marker} in ${mainPath}`)
}

const schemeFiles = (await readdir(schemesDir))
  .filter((file) => file.endsWith('.css'))
  .sort()

if (schemeFiles.length === 0) {
  throw new Error(`No scheme CSS files found in ${schemesDir}`)
}

await mkdir(tempDir, { recursive: true })
await mkdir(outputDir, { recursive: true })

try {
  for (const file of schemeFiles) {
    const scheme = file.slice(0, -'.css'.length)
    const schemeCss = await readFile(join(schemesDir, file), 'utf8')
    const inputPath = join(tempDir, `main-${scheme}.css`)
    const outputPath = join(outputDir, `main-${scheme}.css`)

    // Tailwind needs a real input file so @source paths continue to resolve relative to the theme directory during compilation
    await writeFile(inputPath, mainCss.replace(marker, schemeCss.trim()), 'utf8')
    await run('tailwindcss', ['-i', inputPath, '-o', outputPath, '--minify'])
  }
} finally {
  // The generated public CSS lives in static/css
  // The injected sources are only an implementation detail of this build step
  await rm(tempDir, { recursive: true, force: true })
}
