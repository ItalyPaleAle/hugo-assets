import mermaid from 'mermaid';

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function themeVariables() {
  const dark = darkQuery.matches;
  return {
    primaryColor: dark ? '#fb923c' : '#c2410c',
    primaryTextColor: dark ? '#0f0f0f' : '#fafafa',
    primaryBorderColor: dark ? '#fb923c' : '#c2410c',
    lineColor: dark ? '#a3a3a3' : '#525252',
    secondaryColor: dark ? '#171717' : '#f3f3f3',
    tertiaryColor: dark ? '#1c1c1c' : '#fbe9dc',
    background: dark ? '#0f0f0f' : '#fafafa',
    mainBkg: dark ? '#171717' : '#ffffff',
    nodeBorder: dark ? '#262626' : '#e5e5e5',
    clusterBkg: dark ? '#171717' : '#f3f3f3',
    titleColor: dark ? '#f5f5f5' : '#0a0a0a',
    edgeLabelBackground: dark ? '#1c1c1c' : '#f5f5f5',
  };
}

function initializeMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: darkQuery.matches ? 'dark' : 'default',
    fontFamily: 'Geist, system-ui, sans-serif',
    themeVariables: themeVariables(),
  });
}

async function renderMermaid() {
  initializeMermaid();
  await mermaid.run({ querySelector: '.mermaid' });
}

await renderMermaid();

darkQuery.addEventListener('change', async () => {
  document.querySelectorAll('.mermaid').forEach((el) => {
    const source = el.dataset.source || el.textContent;
    el.dataset.source = source;
    el.removeAttribute('data-processed');
    el.textContent = source;
  });
  await renderMermaid();
});
