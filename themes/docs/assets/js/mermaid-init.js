import mermaid from 'mermaid';

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function siteColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getThemeVariables() {
  const bg = siteColor('--bg');
  const panel = siteColor('--panel');
  const ink = siteColor('--ink');
  const inkSoft = siteColor('--ink-soft');
  const inkMuted = siteColor('--ink-muted');
  const rule = siteColor('--rule');
  const accent = siteColor('--accent');
  const chipBg = siteColor('--chip-bg');
  const calloutBg = siteColor('--callout-bg');

  const line = inkMuted;

  return {
    background: bg,
    mainBkg: panel,
    primaryColor: chipBg,
    primaryTextColor: ink,
    primaryBorderColor: rule,
    secondaryColor: calloutBg,
    secondaryTextColor: ink,
    secondaryBorderColor: rule,
    tertiaryColor: bg,
    tertiaryTextColor: ink,
    tertiaryBorderColor: rule,
    lineColor: line,
    textColor: inkSoft,
    titleColor: ink,
    nodeTextColor: ink,
    nodeBorder: rule,
    clusterBkg: calloutBg,
    clusterBorder: rule,
    edgeLabelBackground: bg,
    labelTextColor: inkSoft,
    actorBkg: panel,
    actorBorder: rule,
    actorTextColor: ink,
    actorLineColor: line,
    signalColor: line,
    signalTextColor: inkSoft,
    activationBkgColor: chipBg,
    activationBorderColor: rule,
    sequenceNumberColor: ink,
    noteBkgColor: calloutBg,
    noteBorderColor: rule,
    noteTextColor: inkSoft,
    labelBoxBkgColor: panel,
    labelBoxBorderColor: rule,
    loopTextColor: inkSoft,
    altBackground: calloutBg,
    sectionBkgColor: chipBg,
    sectionBkgColor2: bg,
    taskBorderColor: rule,
    taskTextColor: ink,
    taskTextOutsideColor: inkSoft,
    taskTextLightColor: ink,
    gridColor: rule,
    todayLineColor: accent,
  };
}

function getThemeCSS() {
  const line = siteColor('--ink-muted');
  const rule = siteColor('--rule');
  const panel = siteColor('--panel');
  const ink = siteColor('--ink');
  const inkSoft = siteColor('--ink-soft');

  return `
    .actor,
    .actor-top,
    .actor-bottom,
    .actor-box,
    rect.actor,
    rect.actor-top,
    rect.actor-bottom,
    rect.actor-box {
      fill: ${panel} !important;
      stroke: ${rule} !important;
    }

    text.actor,
    text.actor > tspan,
    .actor text,
    .actor tspan {
      fill: ${ink} !important;
      stroke: none !important;
    }

    .actor-line,
    line.actor-line,
    .actor-man line,
    .actor-man circle {
      stroke: ${line} !important;
    }

    .edgePath .path,
    .flowchart-link,
    .messageLine0,
    .messageLine1,
    .loopLine,
    .transition,
    .state-start,
    .state-end {
      stroke: ${line} !important;
    }

    .messageText,
    .labelText,
    .loopText,
    .noteText,
    .edgeLabel,
    .edgeLabel p,
    .edgeLabel span {
      color: ${inkSoft} !important;
      fill: ${inkSoft} !important;
      stroke: none !important;
    }

    #arrowhead path,
    #crosshead path,
    .arrowheadPath,
    .arrowMarkerPath,
    marker path,
    marker circle,
    marker polygon {
      fill: ${line} !important;
      stroke: ${line} !important;
    }

    .divider,
    .note,
    rect.note,
    .labelBox,
    .node rect,
    .node polygon,
    .node circle,
    .node ellipse {
      stroke: ${rule} !important;
    }
  `;
}

function initializeMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    fontFamily: 'Geist, system-ui, sans-serif',
    themeVariables: getThemeVariables(),
    themeCSS: getThemeCSS(),
  });
}

async function renderMermaid() {
  initializeMermaid();
  await mermaid.run({ querySelector: '.mermaid' });
}

await renderMermaid();

darkQuery.addEventListener('change', async () => {
  document.querySelectorAll('.mermaid').forEach((el) => {
    const src = el.dataset.src || el.textContent;
    el.dataset.src = src;
    el.removeAttribute('data-processed');
    el.textContent = src;
  });
  await renderMermaid();
});
