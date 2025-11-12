import Konva from 'konva';
import Kanvas from './Kanvas';

function hexToGrayscale(hex: string) {
  const _hex = hex.replace('#', '');
  const r = parseInt(_hex.substring(0, 2), 16);
  const g = parseInt(_hex.substring(2, 4), 16);
  const b = parseInt(_hex.substring(4, 6), 16);
  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  const grayHex = gray.toString(16).padStart(2, '0');
  return `#${grayHex}${grayHex}${grayHex}`;
}

export default class Paint {
  k: Kanvas;
  brushSize: number;
  brushOpacity: number = 1;
  brushMode: string = 'source-over';
  brushColor: string = '#ffffff';
  textFont: string = 'Calibri';
  textValue: string = 'Hello World';
  isPainting: boolean = false;

  constructor(k: Kanvas) {
    this.k = k;
    this.brushSize = this.k.settings.settings.brushSize;
  }

  startPaint() {
    this.k.stopActions();
    this.isPainting = true;
    let lastLine;

    this.k.stage.on('mousedown touchstart', () => {
      if (this.k.imageMode !== 'paint') {
        this.isPainting = false;
        return;
      }
      this.isPainting = true;
      this.k.layer = this.k.selectedLayer === 'image' ? this.k.imageLayer : this.k.maskLayer;
      this.k.group = this.k.selectedLayer === 'image' ? this.k.imageGroup : this.k.maskGroup;
      const pos = this.k.stage.getPointerPosition();
      const brushColor = this.k.selectedLayer === 'image' ? this.k.paint.brushColor : hexToGrayscale(this.k.paint.brushColor);
      if (!pos) return;
      const x = pos.x / this.k.resize.scale;
      const y = pos.y / this.k.resize.scale;
      lastLine = new Konva.Line({
        stroke: brushColor,
        strokeWidth: 2 * this.k.paint.brushSize,
        opacity: this.k.paint.brushOpacity,
        globalCompositeOperation: this.k.paint.brushMode as CanvasRenderingContext2D['globalCompositeOperation'],
        lineCap: 'round', // round cap for smoother lines
        lineJoin: 'round',
        points: [x, y, x, y], // add point twice, so we have some drawings even on a simple click
      });
      lastLine.on('click', () => this.k.selectNode(lastLine));
      this.k.group.add(lastLine);
    });

    this.k.stage.on('mouseup touchend', () => {
      if (this.isPainting) {
        this.isPainting = false;
        lastLine = null;
      }
    });

    this.k.stage.on('mousemove touchmove', (e) => {
      if (this.k.imageMode !== 'paint') return;
      if (!this.isPainting) return;
      e.evt.preventDefault();
      const pos = this.k.stage.getPointerPosition();
      if (!pos || !lastLine) return;
      const x = pos.x / this.k.resize.scale;
      const y = pos.y / this.k.resize.scale;
      const newPoints = lastLine.points().concat([x, y]);
      lastLine.points(newPoints);
    });
  }

  stopPaint() {
    this.isPainting = false;
    this.k.layer.batchDraw();
  }

  startText() {
    this.k.stopActions();
    let isText = true;
    let pos0: Konva.Vector2d | null;
    let pos1: Konva.Vector2d | null;
    this.k.stage.on('mousedown touchstart', () => {
      if (!isText) return;
      pos0 = this.k.stage.getPointerPosition();
      pos1 = null;
    });
    this.k.stage.on('mouseup touchend', () => {
      if (!isText) return;
      pos1 = this.k.stage.getPointerPosition();
      this.k.toolbar.resetButtons();
      let fontSize = 4;
      while (true) { // eslint-disable-line no-constant-condition
        if (!pos0 || !pos1) continue;
        const text = new Konva.Text({
          x: pos0.x,
          y: pos0.y,
          width: pos1.x - pos0.x,
          height: pos1.y - pos0.y,
          text: this.k.paint.textValue,
          fontSize,
          fontFamily: this.k.paint.textFont,
          fill: this.k.paint.brushColor,
          wrap: 'word',
          opacity: this.k.paint.brushOpacity,
          globalCompositeOperation: this.k.paint.brushMode as CanvasRenderingContext2D['globalCompositeOperation'],
          draggable: true,
        });
        const textSize = text.measureSize(this.k.paint.textValue);
        if (textSize.height > (pos1.y - pos0.y) || textSize.width > (pos1.x - pos0.x)) {
          this.k.group.add(text);
          break;
        } else {
          text.destroy();
        }
        fontSize += 2;
      }
      this.k.layer.batchDraw();
      isText = false;
    });
  }
}
