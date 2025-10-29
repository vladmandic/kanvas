import Kanvas from './Kanvas';

export default class Toolbar {
  k: Kanvas;
  constructor(k: Kanvas) {
    this.k = k;
    const container = document.getElementById(`${this.k.containerId}-toolbar`);
    container.classList.add('kanvas-toolbar');
    container.innerHTML = `
      <span class="kanvas-button active" title="Select image layer as active layer" id="${this.k.containerId}-button-image">\udb82\udd76</span>
      <span class="kanvas-button" title="Select mask layer as active layer" id="${this.k.containerId}-button-mask">\udb80\udee9</span>

      <span class="kanvas-separator"> | </span>
      <span class="kanvas-button" title="Upload image to active layer" id="${this.k.containerId}-button-upload">\udb82\udc7c</span>
      <span class="kanvas-button" title="Remove currently selected image" id="${this.k.containerId}-button-remove">\udb85\udc18</span>
      <span class="kanvas-button" title="Reset stage" id="${this.k.containerId}-button-reset">\uf1b8</span>
      <span id="${this.k.containerId}-image-controls" class="kanvas-section active">
        <input type="range" id="${this.k.containerId}-image-opacity" class="kanvas-slider" min="0" max="1" step="0.01" value="1" title="Change image opacity for currently selected image" />
      </span>

      <span class="kanvas-separator"> | </span>
      <span class="kanvas-button" title="Reset actions and refresh vierw" id="${this.k.containerId}-button-refresh">\udb86\uddfe</span>
      <span class="kanvas-button" title="Resize currently selected image" id="${this.k.containerId}-button-resize">\udb81\ude55</span>
      <span class="kanvas-button" title="Crop currently selected image" id="${this.k.containerId}-button-crop">\udb80\udd9e</span>
      <span class="kanvas-button" title="Free Paint in currently selected layer" id="${this.k.containerId}-button-paint">\uf1fc</span>
      <span class="kanvas-button" title="Outpaint" id="${this.k.containerId}-button-outpaint">\udb80\udc4c</span>
      <span class="kanvas-button" title="Apply filters on currently selected image" id="${this.k.containerId}-button-filters">\udb80\udef0</span>
      <span class="kanvas-button" title="Draw text" id="${this.k.containerId}-button-text">\udb80\ude84</span>

      <span id="${this.k.containerId}-paint-controls" class="kanvas-section">
        <span class="kanvas-separator"> | </span>
        <input type="range" id="${this.k.containerId}-brush-size" class="kanvas-slider" min="1" max="100" step="1" value="10" title="Brush size" />
        <input type="range" id="${this.k.containerId}-brush-opacity" class="kanvas-slider" min="0" max="1" step="0.01" value="1" title="Brush opacity" />
        <select id="${this.k.containerId}-brush-mode" class="kanvas-select" title="Brush mode">
          <option value="source-over">source-over</option>
          <option value="destination-out">destination-out</option>
          <option value="darken">darken</option>
          <option value="lighten">lighten</option>
          <option value="color-dodge">color-dodge</option>
          <option value="color-burn">color-burn</option>
          <option value="hard-light">hard-light</option>
          <option value="soft-light">soft-light</option>
          <option value="difference">difference</option>
          <option value="exclusion">exclusion</option>
          <option value="hue">hue</option>
          <option value="saturation">saturation</option>
          <option value="color">color</option>
          <option value="luminosity">luminosity</option>
        </select>
        <input type="color" id="${this.k.containerId}-brush-color" class="kanvas-colorpicker" value="#ffffff" title="Brush color" />
      </span>
      <span id="${this.k.containerId}-outpaint-controls" class="kanvas-section">
        <span class="kanvas-separator"> | </span>
        <input type="range" id="${this.k.containerId}-outpaint-blur" class="kanvas-slider" min="0" max="1" step="0.01" value="0.1" title="Outpaint edge blur" />
        <input type="range" id="${this.k.containerId}-outpaint-expand" class="kanvas-slider" min="-100" max="100" step="1" value="-15 " title="Outpaint edge expand" />
      </span>
      <span id="${this.k.containerId}-filter-controls" class="kanvas-section">
        <span class="kanvas-separator"> | </span>
        <input type="range" id="${this.k.containerId}-filter-value" class="kanvas-slider" min="0" max="100" step="1" value="10" title="Filter value" />
        <select id="${this.k.containerId}-filter-name" class="kanvas-select" title="Active image filter">
          <option value="blur">blur</option>
          <option value="brightness">brightness</option>
          <option value="contrast">contrast</option>
          <option value="enhance">enhance</option>
          <option value="grayscale">grayscale</option>
          <option value="invert">invert</option>
          <option value="mask">mask</option>
          <option value="noise">noise</option>
          <option value="pixelate">pixelate</option>
          <option value="threshold">threshold</option>
        </select>
      </span>
      <span id="${this.k.containerId}-text-controls" class="kanvas-section">
        <span class="kanvas-separator"> | </span>
        <input type="text" id="${this.k.containerId}-text-font" class="kanvas-textbox" value="Calibri" title="Text font" />
        <input type="text" id="${this.k.containerId}-text-value" class="kanvas-textbox" placeholder="enter text" title="Text value" />
      </span>

      <span class="kanvas-separator"> | </span>
      <span class="kanvas-button" title="Zoom in" id="${this.k.containerId}-button-zoomin">\uf531</span>
      <span class="kanvas-button" title="Zoom out" id="${this.k.containerId}-button-zoomout">\uf532</span>
      <span class="kanvas-separator"> | </span>
      <span class="kanvas-text" id="${this.k.containerId}-size"></span>
      <span class="kanvas-text" id="${this.k.containerId}-message"></span>
    `;
  }

  async resetButtons() {
    document.getElementById(`${this.k.containerId}-button-resize`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-button-crop`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-button-paint`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-button-filters`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-button-text`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-button-outpaint`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-paint-controls`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-filter-controls`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-text-controls`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-outpaint-controls`).classList.remove('active');
    this.k.imageLayer.batchDraw();
    this.k.maskLayer.batchDraw();
  }

  async bindControls() {
    // group: image,mask,opacity
    document.getElementById(`${this.k.containerId}-button-image`).addEventListener('click', async () => {
      this.k.selectedLayer = 'image';
      document.getElementById(`${this.k.containerId}-button-image`).classList.add('active');
      document.getElementById(`${this.k.containerId}-button-mask`).classList.remove('active');
      this.k.helpers.showMessage('Active: image layer');
    });
    document.getElementById(`${this.k.containerId}-button-mask`).addEventListener('click', async () => {
      this.k.selectedLayer = 'mask';
      document.getElementById(`${this.k.containerId}-button-image`).classList.remove('active');
      document.getElementById(`${this.k.containerId}-button-mask`).classList.add('active');
      this.k.helpers.showMessage('Active: mask layer');
    });
    document.getElementById(`${this.k.containerId}-image-opacity`).addEventListener('input', async (e) => this.k.upload.updateOpacity(parseFloat((e.target as HTMLInputElement).value)));

    // group: upload,remove,refresh,reset
    document.getElementById(`${this.k.containerId}-button-upload`).addEventListener('click', async () => {
      this.k.imageMode = 'upload';
      this.resetButtons();
      this.k.upload.uploadFile(false);
    });
    document.getElementById(`${this.k.containerId}-button-remove`).addEventListener('click', async () => this.k.removeNode(this.k.selected));
    document.getElementById(`${this.k.containerId}-button-reset`).addEventListener('click', async () => this.k.initialize());
    document.getElementById(`${this.k.containerId}-button-refresh`).addEventListener('click', async () => {
      this.k.stopActions();
      this.resetButtons();
    });

    // group: zoomin,zoomout
    document.getElementById(`${this.k.containerId}-button-zoomin`).addEventListener('click', async () => {
      const scale = this.k.stage.scaleX() * 1.1;
      this.k.stage.scale({ x: scale, y: scale });
      document.getElementById(`${this.k.containerId}-size`).textContent = `Scale: ${Math.round(scale * 100)}%`;
    });
    document.getElementById(`${this.k.containerId}-button-zoomout`).addEventListener('click', async () => {
      const scale = this.k.stage.scaleX() / 1.1;
      this.k.stage.scale({ x: scale, y: scale });
      document.getElementById(`${this.k.containerId}-size`).textContent = `Scale: ${Math.round(scale * 100)}%`;
    });

    // group: reize,crop
    document.getElementById(`${this.k.containerId}-button-resize`).addEventListener('click', async () => {
      this.k.imageMode = 'resize';
      this.k.helpers.showMessage('Image mode=resize');
      this.k.resize.startResize();
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-resize`).classList.add('active');
    });
    document.getElementById(`${this.k.containerId}-button-crop`).addEventListener('click', async () => {
      this.k.imageMode = 'crop';
      this.k.helpers.showMessage('Image mode=crop');
      this.k.resize.startClip();
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-crop`).classList.add('active');
    });

    // group: paint,text
    document.getElementById(`${this.k.containerId}-button-paint`).addEventListener('click', async () => {
      this.k.imageMode = 'paint';
      this.k.helpers.showMessage('Image mode=paint');
      this.k.paint.startPaint();
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-paint`).classList.add('active');
      document.getElementById(`${this.k.containerId}-paint-controls`).classList.add('active');
    });
    document.getElementById(`${this.k.containerId}-button-text`).addEventListener('click', async () => {
      this.k.imageMode = 'text';
      this.k.helpers.showMessage('Image mode=text');
      this.k.paint.startText();
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-text`).classList.add('active');
      document.getElementById(`${this.k.containerId}-paint-controls`).classList.add('active');
      document.getElementById(`${this.k.containerId}-text-controls`).classList.add('active');
    });
    document.getElementById(`${this.k.containerId}-brush-size`).addEventListener('input', async (e) => { this.k.paint.brushSize = parseInt((e.target as HTMLInputElement).value, 10); });
    document.getElementById(`${this.k.containerId}-brush-opacity`).addEventListener('input', async (e) => { this.k.paint.brushOpacity = parseFloat((e.target as HTMLInputElement).value); });
    document.getElementById(`${this.k.containerId}-brush-mode`).addEventListener('input', async (e) => { this.k.paint.brushMode = (e.target as HTMLSelectElement).value; });
    document.getElementById(`${this.k.containerId}-brush-color`).addEventListener('input', async (e) => { this.k.paint.brushColor = (e.target as HTMLInputElement).value; });
    document.getElementById(`${this.k.containerId}-text-font`).addEventListener('input', async (e) => { this.k.paint.textFont = (e.target as HTMLInputElement).value; });
    document.getElementById(`${this.k.containerId}-text-value`).addEventListener('input', async (e) => { this.k.paint.textValue = (e.target as HTMLInputElement).value; });

    // group: outpaint
    document.getElementById(`${this.k.containerId}-button-outpaint`).addEventListener('click', async () => {
      this.k.imageMode = 'outpaint';
      this.resetButtons();
      this.k.paint.startOutpaint();
      document.getElementById(`${this.k.containerId}-button-outpaint`).classList.add('active');
      document.getElementById(`${this.k.containerId}-outpaint-controls`).classList.add('active');
    });
    document.getElementById(`${this.k.containerId}-outpaint-expand`).addEventListener('input', async (e) => {
      this.k.paint.outpaintExpand = parseInt((e.target as HTMLInputElement).value, 10);
      this.k.paint.startOutpaint();
    });
    document.getElementById(`${this.k.containerId}-outpaint-blur`).addEventListener('input', async (e) => {
      this.k.paint.outpaintBlur = parseFloat((e.target as HTMLInputElement).value);
      this.k.paint.startOutpaint();
    });

    // group: filters
    document.getElementById(`${this.k.containerId}-button-filters`).addEventListener('click', async () => {
      this.k.imageMode = 'filters';
      this.k.helpers.showMessage('Image mode=filters');
      this.k.stopActions();
      if (document.getElementById(`${this.k.containerId}-button-filters`).classList.contains('active')) this.k.filter.applyFilter();
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-filters`).classList.add('active');
      document.getElementById(`${this.k.containerId}-filter-controls`).classList.add('active');
    });
    document.getElementById(`${this.k.containerId}-filter-value`).addEventListener('input', async (e) => { this.k.filter.filterValue = parseInt((e.target as HTMLInputElement).value, 10); });
    document.getElementById(`${this.k.containerId}-filter-name`).addEventListener('input', async (e) => { this.k.filter.filterName = (e.target as HTMLSelectElement).value; });
  }
}
