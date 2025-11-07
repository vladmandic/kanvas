import Konva from 'konva';
import Helpers from './Helpers';
import Toolbar from './Toolbar';
import Upload from './Upload';
import Resize from './Resize';
import Paint from './Paint';
import Filter from './Filters';

export default class Kanvas {
  // elements
  containerId: string;
  wrapper: HTMLElement;
  container: HTMLElement;
  // konva objects
  stage: Konva.Stage;
  imageLayer: Konva.Layer;
  maskLayer: Konva.Layer;
  layer: Konva.Layer; // meta
  group: Konva.Group; // meta
  imageGroup: Konva.Group;
  maskGroup: Konva.Group;
  selected: Konva.Node;
  // modes
  selectedLayer: 'image' | 'mask' = 'image';
  imageMode: 'upload' | 'resize' | 'crop' | 'paint' | 'filters' | 'text' | 'outpaint' = 'upload';
  // variables
  opacity: number = 1;
  // class extensions
  toolbar: Toolbar;
  helpers: Helpers;
  upload: Upload;
  resize: Resize;
  paint: Paint;
  filter: Filter;

  initImage() {
    this.imageLayer = new Konva.Layer();
    this.imageGroup = new Konva.Group();
    this.imageLayer.add(this.imageGroup);
    return this.imageLayer;
  }

  initMask() {
    this.maskLayer = new Konva.Layer();
    this.maskGroup = new Konva.Group();
    this.maskLayer.add(this.maskGroup);
    return this.maskLayer;
  }

  initialize() {
    // init stage/layer/group
    this.stage = new Konva.Stage({
      container: `${this.containerId}-kanvas`,
      width: 1024,
      height: 256,
    });
    this.stage.add(this.initImage());
    this.stage.add(this.initMask());
    this.layer = this.selectedLayer === 'image' ? this.imageLayer : this.maskLayer;
    this.group = this.selectedLayer === 'image' ? this.imageGroup : this.maskGroup;
    console.log(`Kanvas: konva=${Konva.version} width=${this.stage.width()} height=${this.stage.height()} id="${this.containerId}"`); // eslint-disable-line no-console
  }

  constructor(containerId: string) {
    this.containerId = containerId;
    this.wrapper = document.getElementById(containerId) as HTMLElement;
    this.wrapper.className = 'kanvas-wrapper';
    this.wrapper.innerHTML = `
      <div id="${this.containerId}-toolbar"></div>
      <div class="kanvas" id="${this.containerId}-kanvas" style="margin: auto; width: 100%; height: 100%;"></div>
    `;
    this.container = document.getElementById(`${this.containerId}-kanvas`) as HTMLElement;
    this.initialize();

    // init helpers
    this.helpers = new Helpers(this);
    this.toolbar = new Toolbar(this);
    this.resize = new Resize(this);
    this.upload = new Upload(this);
    this.paint = new Paint(this);
    this.filter = new Filter(this);

    // init events
    this.helpers.bindEvents();
    this.toolbar.bindControls();

    // initial size
    const resizeObserver = new ResizeObserver(() => this.resize.fitStage(this.wrapper));
    resizeObserver.observe(this.wrapper);
  }

  async selectNode(node: Konva.Node) {
    this.selected = node;
    const nodeType = this.selected.getClassName();
    this.helpers.showMessage(`Selected: ${nodeType} x=${Math.round(this.selected.x())} y=${Math.round(this.selected.y())} width=${Math.round(this.selected.width())} height=${Math.round(this.selected.height())}`);
  }

  async removeNode(node: Konva.Node) {
    if (!node) return;
    const nodeType = node.getClassName();
    node.destroy();
    for (const shape of this.layer.getChildren()) {
      if (shape instanceof Konva.Transformer && shape.nodes().includes(node)) shape.destroy();
    }
    this.layer.draw();
    this.helpers.showMessage(`Node removed: ${nodeType}`);
  }

  stopActions() {
    this.resize.stopClip();
    this.resize.stopResize();
    this.paint.stopPaint();
    this.paint.stopOutpaint();
    /*
    const shapes = this.k.stage.find('Shape');
    for (const shape of shapes) {
    }
    */
  }
}

// expose Kanvas globally
declare global {
  interface Window {
    Kanvas: typeof Kanvas;
    kanvas: (el: string) => Kanvas; // eslint-disable-line no-unused-vars
  }
}
window.Kanvas = Kanvas;
window.kanvas = (el: string) => new Kanvas(el);
