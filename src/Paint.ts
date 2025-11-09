import Konva from 'konva';
import Kanvas from './Kanvas';
import { fillTransparent } from './Fill';

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
  outpaintBlur: number = 0.1;
  outpaintExpand: number = -15;
  textFont: string = 'Calibri';
  textValue: string = 'Hello World';

  constructor(k: Kanvas) {
    this.k = k;
    this.brushSize = this.k.settings.settings.brushSize;
  }

  startPaint() {
    this.k.stopActions();
    let isPaint = false;
    let lastLine;

    this.k.stage.on('mousedown touchstart', () => {
      if (this.k.imageMode !== 'paint') return;
      isPaint = true;
      this.k.layer = this.k.selectedLayer === 'image' ? this.k.imageLayer : this.k.maskLayer;
      this.k.group = this.k.selectedLayer === 'image' ? this.k.imageGroup : this.k.maskGroup;
      const pos = this.k.stage.getPointerPosition();
      const brushColor = this.k.selectedLayer === 'image' ? this.k.paint.brushColor : hexToGrayscale(this.k.paint.brushColor);
      if (!pos) return;
      lastLine = new Konva.Line({
        stroke: brushColor,
        strokeWidth: 2 * this.k.paint.brushSize,
        opacity: this.k.paint.brushOpacity,
        globalCompositeOperation: this.k.paint.brushMode as CanvasRenderingContext2D['globalCompositeOperation'],
        lineCap: 'round', // round cap for smoother lines
        lineJoin: 'round',
        points: [pos.x, pos.y, pos.x, pos.y], // add point twice, so we have some drawings even on a simple click
      });
      this.k.group.add(lastLine);
    });

    this.k.stage.on('mouseup touchend', () => {
      isPaint = false;
    });

    this.k.stage.on('mousemove touchmove', (e) => {
      if (this.k.imageMode !== 'paint') return;
      if (!isPaint) return;
      e.evt.preventDefault();
      const pos = this.k.stage.getPointerPosition();
      if (!pos) return;
      const newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);
    });
  }

  stopPaint() {
    this.k.layer.find('Line').forEach((line) => line.destroy());
    this.k.layer.find('Transformer').forEach((t) => t.destroy());
    this.k.layer.batchDraw();
  }

  fillOutpaint() {
    const canvas = this.k.imageLayer.toCanvas() as HTMLCanvasElement;
    const { top, bottom, left, right } = fillTransparent(canvas, 0);
    for (const fill of [top, bottom, left, right]) {
      const imgDataUrl = fill.toDataURL();
      const img = new Image();
      img.src = imgDataUrl;
      img.onload = () => {
        const konvaImg = new Konva.Image({
          x: 0,
          y: 0,
          image: img,
          width: this.k.stage.width(),
          height: this.k.stage.height(),
        });
        konvaImg.name('fill');
        this.k.imageGroup.add(konvaImg);
        this.k.imageLayer.batchDraw();
      };
    }
  }

  startOutpaint() {
    this.k.stopActions();
    this.k.imageMode = 'outpaint';
    this.k.helpers.showMessage(`Image mode=outpaint blur=${this.k.paint.outpaintBlur} expand=${this.k.paint.outpaintExpand}`);
    if (this.k.settings.settings.outpaintFill) {
      this.fillOutpaint(); // edges
      this.fillOutpaint(); // corners
    }
    const fillRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.k.stage.width(),
      height: this.k.stage.height(),
      fill: 'white',
      // opacity: 0.5,
    });
    this.k.maskGroup.add(fillRect);
    const images = this.k.stage.find('Image');
    for (const image of images) {
      if (image.name() === 'fill') continue;
      const imageRect = new Konva.Rect({
        x: image.x() - (this.outpaintExpand / 2),
        y: image.y() - (this.outpaintExpand / 2),
        width: (image.width() * image.scaleX()) + (this.outpaintExpand),
        height: (image.height() * image.scaleY()) + (this.outpaintExpand),
        fill: 'black',
        globalCompositeOperation: 'destination-out', // punch hole
      });
      this.k.maskGroup.add(imageRect);
    }
    this.k.maskGroup.cache();
    this.k.maskGroup.filters([Konva.Filters.Blur]);
    this.k.maskGroup.blurRadius(this.outpaintBlur * 100);
    this.k.layer.batchDraw();
  }

  stopOutpaint() {
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
