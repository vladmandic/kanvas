import '../dist/kanvas.esm.js';

let kanvasInstance = null;
const kanvasElement = 'control_input_select';

async function initKanvas() {
  while (!document.getElementById(kanvasElement)) await new Promise(resolve => setTimeout(resolve, 100)); // wait for element
  const el = document.getElementById(kanvasElement);
  el.innerHTML = '';
  kanvasInstance = kanvas(kanvasElement); // bind to container
  window.kanvas = kanvasInstance; // expose to global
}

onUiReady(initKanvas);
