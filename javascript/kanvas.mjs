import '../dist/kanvas.esm.js';

let kanvasInstance = null;
const kanvasElement = 'kanvas-container';
const kanvasChangeButton = 'kanvas-change-button';

async function initKanvas() {
  while (!document.getElementById(kanvasElement)) await new Promise((resolve) => setTimeout(resolve, 100)); // eslint-disable-line no-promise-executor-return
  const el = document.getElementById(kanvasElement);
  el.innerHTML = '';
  kanvasInstance = new Kanvas(kanvasElement); // eslint-disable-line no-undef
  const btn = document.getElementById(kanvasChangeButton);
  if (btn) kanvasInstance.onchange = () => btn.click();
  window.kanvas = kanvasInstance; // expose to global
}

onUiReady(initKanvas); // eslint-disable-line no-undef
