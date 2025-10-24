import Konva from 'konva';
import Kanvas from './Kanvas';

export default class Resize {
  k: Kanvas;
  clipBox: Konva.Rect;
  constructor(k: Kanvas) {
    this.k = k;
  }

  async resizeStage(el: Konva.Image | Konva.Group) {
    const box = el.getClientRect();
    const width = this.k.stage.width();
    const height = this.k.stage.height();
    if (el === this.k.group) {
      if (box.x > 0) this.k.stage.width(width - box.x);
      if (box.y > 0) this.k.stage.height(height - box.y);
      if (box.width < width) this.k.stage.width(box.width);
      if (box.height < height) this.k.stage.height(box.height);
      for (const child of el.getChildren()) child.setPosition({ x: 0, y: 0 });
      this.k.helpers.showMessage(`Resize group: x=${Math.round(box.x)} y=${Math.round(box.y)} width=${Math.round(box.width)} height=${Math.round(box.height)}`);
    } else {
      if (box.x + box.width > this.k.stage.width()) this.k.stage.width(box.x + box.width);
      if (box.y + box.height > this.k.stage.height()) this.k.stage.height(box.y + box.height);
      this.k.helpers.showMessage(`Resize image: x=${Math.round(box.x)} y=${Math.round(box.y)} width=${Math.round(box.width)} height=${Math.round(box.height)}`);
    }
    if (width !== this.k.stage.width() || height !== this.k.stage.height()) {
      this.k.imageLayer.size({ width: this.k.stage.width(), height: this.k.stage.height() });
      this.k.maskLayer.size({ width: this.k.stage.width(), height: this.k.stage.height() });
      const sizeEl = document.getElementById(`${this.k.containerId}-size`);
      if (sizeEl) sizeEl.textContent = `${Math.round(this.k.stage.width() / this.k.stage.scaleX())} x ${Math.round(this.k.stage.height() / this.k.stage.scaleY())}`;
    }
  }

  startResize() {
    this.k.stopActions();
    const images = this.k.stage.find('Image');
    images.forEach((image) => {
      image.draggable(true);
      const transformer = new Konva.Transformer({
        nodes: [image],
        borderStroke: '#298',
        borderStrokeWidth: 3,
        anchorFill: '#298',
        anchorStroke: '#298',
        anchorStrokeWidth: 2,
        anchorSize: 10,
        anchorCornerRadius: 2,
      });
      this.k.layer.add(transformer);
      image.on('transform', () => this.resizeStage(image as Konva.Image));
      image.on('dragmove', () => this.resizeStage(image as Konva.Image));
    });
  }

  stopResize() {
    const images = this.k.stage.find('Image');
    images.forEach((image) => image.draggable(false));
    this.k.layer.find('Transformer').forEach((t) => t.destroy());
    this.k.layer.batchDraw();
  }

  async applyClip(clipBox: Konva.Rect) {
    const box = clipBox.getClientRect();
    this.k.group.clip({
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    });
    this.k.layer.batchDraw();
  }

  startClip() {
    this.k.stopActions();
    const box = this.k.group.getClientRect();
    this.clipBox = new Konva.Rect({
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      stroke: '#923',
      draggable: true,
    });
    this.k.group.add(this.clipBox);
    const clipTransformer = new Konva.Transformer({
      nodes: [this.clipBox],
      rotateEnabled: false,
      borderStroke: '#923',
      borderStrokeWidth: 3,
      anchorFill: '#923',
      anchorStroke: '#923',
      anchorStrokeWidth: 2,
      anchorSize: 10,
      anchorCornerRadius: 2,
    });
    this.k.layer.add(clipTransformer);
    this.clipBox.on('transformend dragend', () => this.applyClip(this.clipBox));
  }

  stopClip() {
    if (this.clipBox) this.clipBox.destroy();
    this.k.layer.find('Transformer').forEach((t) => t.destroy());
    // this.k.group.clip(null);
    this.k.layer.batchDraw();
  }
}
