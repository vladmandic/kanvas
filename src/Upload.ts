import Konva from 'konva';
import Kanvas from './Kanvas';

export default class Upload {
  k: Kanvas;
  constructor(k: Kanvas) {
    this.k = k;
  }

  async uploadImage(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    const rect = this.k.stage.container().getBoundingClientRect();
    const dropX = this.k.helpers.isEmpty() ? 0 : (e.clientX || 0) - rect.left;
    const dropY = this.k.helpers.isEmpty() ? 0 : (e.clientY || 0) - rect.top;
    for (const file of files as File[]) {
      if (!file.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(file);
      const dropImage = new Image();
      this.k.layer = this.k.selectedLayer === 'image' ? this.k.imageLayer : this.k.maskLayer;
      this.k.group = this.k.selectedLayer === 'image' ? this.k.imageGroup : this.k.maskGroup;
      dropImage.onload = () => { // eslint-disable-line no-loop-func
        if (!this.k.stage) return;
        const image = new Konva.Image({
          image: dropImage,
          x: dropX,
          y: dropY,
          draggable: false,
          opacity: this.k.opacity,
        });
        this.k.helpers.showMessage(`loaded ${this.k.selectedLayer}: ${file.name} width=${image.width()} height=${image.height()}`);
        URL.revokeObjectURL(url);
        if (this.k.helpers.isEmpty()) {
          this.k.stage.size({ width: 0, height: 0 });
          this.k.resize.resizeStage(image);
        }
        this.k.group.add(image);
        if (this.k.selectedLayer === 'mask') {
          image.cache();
          image.filters([Konva.Filters.Grayscale]);
          image.opacity(0.5);
        }
        image.on('transform', () => this.k.resize.resizeStage(image));
        image.on('dragmove', () => this.k.resize.resizeStage(image));
        image.on('click', () => this.k.selectNode(image));
        this.k.stage.batchDraw();
        this.k.resize.resizeStage(image);
      };
      dropImage.onerror = () => URL.revokeObjectURL(url);
      dropImage.src = url;
    }
  }

  async uploadFile(checkEmpty: boolean = true) {
    if (checkEmpty && !this.k.helpers.isEmpty()) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e) => this.uploadImage(e);
    input.click();
  }
}
