const filters = document.querySelector('.filters');
const filterCount = document.querySelector('.filter-count');
const milestones = document.querySelectorAll('[data-stage]');

if (filters) {
  const buttons = filters.querySelectorAll('button[data-filter]');

  function applyFilter(selected) {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button === selected));
    }

    const stage = selected.dataset.filter;
    let visible = 0;
    for (const milestone of milestones) {
      const matches = stage === 'all' || milestone.dataset.stage === stage;
      milestone.hidden = !matches;
      if (matches) visible++;
    }

    if (filterCount) {
      filterCount.textContent = visible + (visible === 1 ? ' milestone' : ' milestones');
    }
  }

  const initial = filters.querySelector('button[data-filter][aria-pressed="true"]') ?? buttons[0];
  if (initial) {
    applyFilter(initial);
    filters.hidden = false;
    filters.addEventListener('click', (event) => {
      const selected = event.target instanceof Element ? event.target.closest('button[data-filter]') : null;
      if (selected && filters.contains(selected)) applyFilter(selected);
    });
  }
}

const previewControls = document.querySelector('[data-preview-controls]');
const previewPanels = document.querySelectorAll('[data-preview-panel]');

if (previewControls && previewPanels.length > 0) {
  const buttons = previewControls.querySelectorAll('button[data-preview]');

  function showPreview(selected) {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button === selected));
    }

    for (const panel of previewPanels) {
      panel.hidden = panel.dataset.previewPanel !== selected.dataset.preview;
    }
  }

  const initial = previewControls.querySelector('button[data-preview][aria-pressed="true"]') ?? buttons[0];
  if (initial) {
    showPreview(initial);
    previewControls.hidden = false;
    previewControls.addEventListener('click', (event) => {
      const selected = event.target instanceof Element ? event.target.closest('button[data-preview]') : null;
      if (selected && previewControls.contains(selected)) showPreview(selected);
    });
  }
}
const appearance = document.querySelector('.appearance');
if (appearance) {
  const key = 'days-to-us:appearance';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'dark' || saved === 'light') appearance.value = saved;
  } catch {
    // The system preference also works when storage is disabled.
  }
  function applyAppearance() {
    const dark = appearance.value === 'dark' || (appearance.value === 'system' && system.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#17141c' : '#faf5ee');
  }
  applyAppearance();
  appearance.hidden = false;
  system.addEventListener('change', applyAppearance);
  appearance.addEventListener('change', () => {
    applyAppearance();
    try {
      if (appearance.value === 'system') localStorage.removeItem(key);
      else localStorage.setItem(key, appearance.value);
    } catch {
      // Keep the selection for this page even if it cannot be saved.
    }
  });
}
