import Konva from 'konva';
import Kanvas from './Kanvas';

export default class Paint {
  k: Kanvas;
  brushSize: number = 10;
  brushOpacity: number = 1;
  brushMode: string = 'source-over';
  brushColor: string = '#ffffff';

  constructor(k: Kanvas) {
    this.k = k;
  }

  startPaint() {
    this.k.stopActions();
    let isPaint = false;
    let lastLine;

    this.k.stage.on('mousedown touchstart', () => {
      if (this.k.imageMode !== 'paint') return;
      isPaint = true;
      const pos = this.k.stage.getPointerPosition();
      lastLine = new Konva.Line({
        stroke: this.k.paint.brushColor,
        strokeWidth: 2 * this.k.paint.brushSize,
        opacity: this.k.paint.brushOpacity,
        globalCompositeOperation: this.k.paint.brushMode as CanvasRenderingContext2D['globalCompositeOperation'],
        lineCap: 'round', // round cap for smoother lines
        lineJoin: 'round',
        points: [pos.x, pos.y, pos.x, pos.y], // add point twice, so we have some drawings even on a simple click
      });
      this.k.layer.add(lastLine);
    });

    this.k.stage.on('mouseup touchend', () => {
      isPaint = false;
    });

    this.k.stage.on('mousemove touchmove', (e) => {
      if (this.k.imageMode !== 'paint') return;
      if (!isPaint) return;
      e.evt.preventDefault();
      const pos = this.k.stage.getPointerPosition();
      const newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);
    });
  }

  stopPaint() {
    this.k.layer.find('Line').forEach((line) => line.destroy());
    this.k.layer.find('Transformer').forEach((t) => t.destroy());
    this.k.layer.batchDraw();
  }
}

/*
// create tool select
const select = document.createElement('select');
select.innerHTML = `
  <option value="brush">Brush</option>
  <option value="eraser">Eraser</option>
`;
document.body.appendChild(select);

const width = window.innerWidth;
const height = window.innerHeight - 25;

// first we need Konva core things: stage and layer
const stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
});

const layer = new Konva.Layer();
stage.add(layer);

select.addEventListener('change', function () {
  mode = select.value;
});
*/
