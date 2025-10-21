import Konva from 'konva';
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
    msgEl.textContent = ' | ' + msg;
    setTimeout(() => { msgEl.textContent = ''; }, duration);
  }

  async bindToggles() {
    this.k.stage.on('click tap', () => this.k.upload.uploadFile());
    this.k.stage.on('dblclick dbltap', () => this.k.resize.resizeStage(this.k.group));
    this.k.container.addEventListener('dragover', (e) => e.preventDefault());
    this.k.container.addEventListener('dragleave', (e) => e.preventDefault());
    this.k.container.addEventListener('drop', async (e) => this.k.upload.uploadImage(e));

    document.getElementById(`${this.k.containerId}-toggle-image-mask`).addEventListener('change', (e: Event) => {
      this.k.imageMode = (e.target as HTMLInputElement).checked ? 'mask' : 'image';
      this.showMessage(`mode: ${this.k.imageMode}`);
    });

    document.getElementById(`${this.k.containerId}-toggle-resize-crop`).addEventListener('change', (e: Event) => {
      this.k.cropMode = (e.target as HTMLInputElement).checked ? 'crop' : 'resize';
      this.showMessage(`mode: ${this.k.cropMode}`);
    });

    document.getElementById(`${this.k.containerId}-toggle-paint-move`).addEventListener('change', (e: Event) => {
      this.k.paintMove = (e.target as HTMLInputElement).checked ? 'paint' : 'move';
      for (const shape of this.k.layer.getChildren()) {
        if (shape instanceof Konva.Transformer) shape.destroy();
        this.k.paint.startPaint();
      }
      for (const shape of this.k.group.getChildren()) {
        shape.draggable(this.k.paintMove === 'move');
        if (this.k.paintMove === 'move') {
          const transformer = new Konva.Transformer({ nodes: [shape] });
          this.k.layer.add(transformer);
        }
      }
      this.k.helpers.showMessage(`mode: ${this.k.paintMove}`);
    });
  }
}
