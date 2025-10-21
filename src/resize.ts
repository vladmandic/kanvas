import Konva from 'konva';
import Kanvas from './Kanvas';

export default class Resize {
  k: Kanvas;
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
      this.k.helpers.showMessage(`resize group: x=${Math.round(box.x)} y=${Math.round(box.y)} width=${Math.round(box.width)} height=${Math.round(box.height)}`);
    } else {
      if (box.x + box.width > this.k.stage.width()) this.k.stage.width(box.x + box.width);
      if (box.y + box.height > this.k.stage.height()) this.k.stage.height(box.y + box.height);
      this.k.helpers.showMessage(`resize image: x=${Math.round(box.x)} y=${Math.round(box.y)} width=${Math.round(box.width)} height=${Math.round(box.height)}`);
    }
    if (width !== this.k.stage.width() || height !== this.k.stage.height()) {
      this.k.layer.size({ width: this.k.stage.width(), height: this.k.stage.height() });
      const sizeEl = document.getElementById(`${this.k.containerId}-size`);
      if (sizeEl) sizeEl.textContent = `${Math.round(this.k.stage.width())} x ${Math.round(this.k.stage.height())}`;
    }
  }
}
