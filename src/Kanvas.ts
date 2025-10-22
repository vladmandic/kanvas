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
  layer: Konva.Layer;
  group: Konva.Group;
  selected: Konva.Node;
  // modes
  selectedLayer: 'image' | 'mask' = 'image';
  imageMode: 'upload' | 'resize' | 'crop' | 'paint' | 'filters' | 'text' = 'upload';
  cropMode: 'crop' | 'resize' = 'crop';
  // class extensions
  toolbar: Toolbar;
  helpers: Helpers;
  upload: Upload;
  resize: Resize;
  paint: Paint;
  filter: Filter;

  initialize() {
    // init stage/layer/group
    this.stage = new Konva.Stage({
      container: `${this.containerId}-kanvas`,
      width: 1024,
      height: 1024,
    });
    this.layer = new Konva.Layer();
    this.group = new Konva.Group();
    this.layer.add(this.group);
    this.stage.add(this.layer);
  }

  constructor(containerId: string) {
    this.containerId = containerId;
    this.wrapper = document.getElementById(containerId);
    this.wrapper.className = 'kanvas-wrapper';
    this.wrapper.innerHTML = `
      <div id="${this.containerId}-toolbar"></div>
      <div class="kanvas" id="${this.containerId}-kanvas" style="margin: auto;"></div>
    `;
    this.container = document.getElementById(`${this.containerId}-kanvas`);
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
  }

  async selectNode(node: Konva.Node) {
    this.selected = node;
    const nodeType = this.selected.getClassName();
    this.helpers.showMessage(`selected: ${nodeType} x=${Math.round(this.selected.x())} y=${Math.round(this.selected.y())} width=${Math.round(this.selected.width())} height=${Math.round(this.selected.height())}`);
  }

  async removeNode(node: Konva.Node) {
    if (!node) return;
    node.destroy();
    for (const shape of this.layer.getChildren()) {
      if (shape instanceof Konva.Transformer && shape.nodes().includes(node)) shape.destroy();
    }
    this.layer.draw();
    this.helpers.showMessage('node removed');
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
