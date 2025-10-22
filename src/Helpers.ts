import Kanvas from './Kanvas';

export default class Helpers {
  k: Kanvas;
  constructor(k: Kanvas) {
    this.k = k;
  }

  isEmpty() {
    return !this.k.stage || !this.k.layer || !this.k.group || !this.k.stage.hasChildren() || this.k.group.getChildren().length === 0;
  }

  async showMessage(msg: string, duration = 2000) {
    console.log(msg); // eslint-disable-line no-console
    const msgEl = document.getElementById(`${this.k.containerId}-message`);
    if (!msgEl) return;
    msgEl.textContent = msg;
    setTimeout(() => { msgEl.textContent = ''; }, duration);
  }

  async bindEvents() {
    // this.k.stage.on('contextmenu', (e) => {});
    this.k.stage.on('click tap', () => this.k.upload.uploadFile());
    this.k.stage.on('dblclick dbltap', () => this.k.resize.resizeStage(this.k.group));
    this.k.stage.on('wheel', (e) => {
      e.evt.preventDefault();
      const scale = e.evt.deltaY > 0 ? this.k.stage.scaleX() / 1.05 : this.k.stage.scaleX() * 1.05;
      this.k.stage.scale({ x: scale, y: scale });
      this.k.stage.batchDraw();
      this.showMessage(`scale: ${Math.round(scale * 100)}%`, 1000);
    });
    this.k.container.addEventListener('dragover', (e) => e.preventDefault());
    this.k.container.addEventListener('dragleave', (e) => e.preventDefault());
    this.k.container.addEventListener('drop', async (e) => this.k.upload.uploadImage(e));
  }
}
