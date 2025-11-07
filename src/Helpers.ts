import Kanvas from './Kanvas';

export default class Helpers {
  k: Kanvas;
  constructor(k: Kanvas) {
    this.k = k;
  }

  isEmpty() {
    // const groups = this.k.imageGroup.getChildren().length + this.k.maskGroup.getChildren().length;
    const images = this.k.stage.find('Image');
    return images.length === 0;
  }

  async showMessage(msg: string, duration = 4000) {
    // @ts-ignore
    if (typeof log !== 'undefined') log('Kanvas', msg); // eslint-disable-line no-undef
    else console.log('Kanvas', msg); // eslint-disable-line no-console
    const msgEl = document.getElementById(`${this.k.containerId}-message`);
    if (!msgEl) return;
    msgEl.classList.remove('fade-out');
    msgEl.innerHTML = '<span class="kanvas-separator"> | </span>' + msg;
    msgEl.classList.add('active');
    setTimeout(() => {
      msgEl.classList.remove('active');
      msgEl.innerHTML = '';
    }, duration);
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
      this.showMessage(`Scale: ${Math.round(scale * 100)}%`);
    });
    this.k.container.addEventListener('dragover', (e) => e.preventDefault());
    this.k.container.addEventListener('dragleave', (e) => e.preventDefault());
    this.k.container.addEventListener('drop', async (e) => this.k.upload.uploadImage(e));
  }
}
