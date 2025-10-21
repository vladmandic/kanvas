import Konva from 'konva';
import Helpers from './Helpers';
import Upload from './Upload';
import Resize from './Resize';
import Paint from './Paint';

export default class Kanvas {
  containerId: string;
  wrapper: HTMLElement;
  container: HTMLElement;
  stage: Konva.Stage;
  layer: Konva.Layer;
  group: Konva.Group;
  selected: Konva.Node;
  // modes
  paintMove: 'paint' | 'move' = 'move';
  imageMode: 'mask' | 'image' = 'image';
  cropMode: 'crop' | 'resize' = 'crop';
  // class extensions
  helpers: Helpers;
  upload: Upload;
  resize: Resize;
  paint: Paint;

  constructor(containerId: string) {
    this.containerId = containerId;
    this.wrapper = document.getElementById(containerId);
    this.wrapper.className = 'kanvas-wrapper';
    this.wrapper.innerHTML = `
      <div id="${this.containerId}-toolbar">
        <toggle-switch id="${this.containerId}-toggle-image-mask" data-on="mask" data-off="image"></toggle-switch>
        <toggle-switch id="${this.containerId}-toggle-resize-crop" data-on="crop" data-off="resize"></toggle-switch>
        <toggle-switch id="${this.containerId}-toggle-paint-move" data-on="paint" data-off="move" ></toggle-switch>
        <span class="kanvas-text" id="${this.containerId}-size"></span>
        <span class="kanvas-text" id="${this.containerId}-message"></span>
      </div>
      <div class="kanvas" id="${this.containerId}-kanvas" style="margin: auto;"></div>
    `;
    this.container = document.getElementById(`${this.containerId}-kanvas`);

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

    // init helpers
    this.helpers = new Helpers(this);
    this.resize = new Resize(this);
    this.upload = new Upload(this);
    this.paint = new Paint(this);

    // init events
    this.helpers.bindToggles();
  }

  async selectNode(node: Konva.Node) {
    this.selected = node;
    const nodeType = this.selected.getClassName();
    this.helpers.showMessage(`selected: ${nodeType} x=${Math.round(this.selected.x())} y=${Math.round(this.selected.y())} width=${Math.round(this.selected.width())} height=${Math.round(this.selected.height())}`);
  }
}

declare global {
  interface Window {
    Kanvas: typeof Kanvas;
    kanvas: (el: string) => Kanvas; // eslint-disable-line no-unused-vars
  }
}
window.Kanvas = Kanvas;
window.kanvas = (el: string) => new Kanvas(el);
