import Kanvas from './Kanvas';

export default class Toolbar {
  k: Kanvas;
  constructor(k: Kanvas) {
    this.k = k;
    const container = document.getElementById(`${this.k.containerId}-toolbar`);
    container.innerHTML = `
      <span class="kanvas-button active" title="select image layer" id="${this.k.containerId}-button-image">image</span>
      <span class="kanvas-button" title="select mask layer" id="${this.k.containerId}-button-mask">mask</span>
      <span class="kanvas-separator"> | </span>
      <span class="kanvas-button" title="upload image" id="${this.k.containerId}-button-upload">upload</span>
      <span class="kanvas-button" title="remove image" id="${this.k.containerId}-button-remove">remove</span>
      <span class="kanvas-button" title="reset stage" id="${this.k.containerId}-button-reset">reset</span>
      <span class="kanvas-separator"> | </span>
      <span class="kanvas-button" title="resize image" id="${this.k.containerId}-button-resize">resize</span>
      <span class="kanvas-button disabled" title="crop image" id="${this.k.containerId}-button-crop">crop</span>
      <span class="kanvas-button" title="paint controls" id="${this.k.containerId}-button-paint">paint</span>
      <span class="kanvas-paint-controls" id="${this.k.containerId}-paint-controls" style="display: none;">
        <input type="range" id="${this.k.containerId}-brush-size" class="kanvas-slider" min="1" max="100" step="1" value="10" title="brush size" />
        <input type="range" id="${this.k.containerId}-brush-feather" class="kanvas-slider" min="0" max="100" step="1" value="0" title="brush feather" />
        <input type="range" id="${this.k.containerId}-brush-opacity" class="kanvas-slider" min="0" max="1" step="0.01" value="1" title="brush opacity" />
        <select id="${this.k.containerId}-brush-mode" class="kanvas-select" title="brush mode">
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
        <input type="color" id="${this.k.containerId}-brush-color" class="kanvas-colorpicker" value="#ffffff" title="brush color" />
      </span>
      <span class="kanvas-button disabled" title="outpaint" id="${this.k.containerId}-button-outpaint">outpaint</span>
      <span class="kanvas-button" title="image filters" id="${this.k.containerId}-button-filters">filters</span>
      <span class="kanvas-button" id="${this.k.containerId}-filter-controls" style="display: none;">
        <input type="range" id="${this.k.containerId}-filter-value" class="kanvas-slider" min="0" max="100" step="1" value="10" title="filter value" />
        <select id="${this.k.containerId}-filter-name" class="kanvas-select" title="filter name">
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
      <span class="kanvas-button disabled" title="draw text" id="${this.k.containerId}-button-text">text</span>
      <span class="kanvas-separator"> | </span>
      <span class="kanvas-button" title="zoom in" id="${this.k.containerId}-button-zoomin">zoom in</span>
      <span class="kanvas-button" title="zoom out" id="${this.k.containerId}-button-zoomout">zoom out</span>
      <span class="kanvas-separator"> | </span>
      <span class="kanvas-text" id="${this.k.containerId}-size"></span>
      <span class="kanvas-separator"> | </span>
      <span class="kanvas-text" id="${this.k.containerId}-message"></span>
      <span class="kanvas-separator"> | </span>
    `;
  }

  async resetButtons() {
    document.getElementById(`${this.k.containerId}-button-resize`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-button-crop`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-button-paint`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-button-filters`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-button-text`).classList.remove('active');
    document.getElementById(`${this.k.containerId}-paint-controls`).style.display = 'none';
    document.getElementById(`${this.k.containerId}-filter-controls`).style.display = 'none';
  }

  async bindControls() {
    // group: image,mask
    document.getElementById(`${this.k.containerId}-button-image`).addEventListener('click', async () => {
      this.k.selectedLayer = 'image';
      document.getElementById(`${this.k.containerId}-button-image`).classList.add('active');
      document.getElementById(`${this.k.containerId}-button-mask`).classList.remove('active');
    });
    document.getElementById(`${this.k.containerId}-button-mask`).addEventListener('click', async () => {
      this.k.selectedLayer = 'mask';
      document.getElementById(`${this.k.containerId}-button-image`).classList.remove('active');
      document.getElementById(`${this.k.containerId}-button-mask`).classList.add('active');
    });

    // group: upload,remove,reset
    document.getElementById(`${this.k.containerId}-button-upload`).addEventListener('click', async () => {
      this.k.imageMode = 'upload';
      this.resetButtons();
      this.k.upload.uploadFile(false);
    });
    document.getElementById(`${this.k.containerId}-button-remove`).addEventListener('click', async () => this.k.removeNode(this.k.selected));
    document.getElementById(`${this.k.containerId}-button-reset`).addEventListener('click', async () => this.k.initialize());

    // group: zoomin,zoomout
    document.getElementById(`${this.k.containerId}-button-zoomin`).addEventListener('click', async () => {
      const scale = this.k.stage.scaleX() * 1.1;
      this.k.stage.scale({ x: scale, y: scale });
      document.getElementById(`${this.k.containerId}-size`).textContent = `scale: ${Math.round(scale * 100)}%`;
    });
    document.getElementById(`${this.k.containerId}-button-zoomout`).addEventListener('click', async () => {
      const scale = this.k.stage.scaleX() / 1.1;
      this.k.stage.scale({ x: scale, y: scale });
      document.getElementById(`${this.k.containerId}-size`).textContent = `scale: ${Math.round(scale * 100)}%`;
    });

    // group: reize,crop,paint,filters,text
    document.getElementById(`${this.k.containerId}-button-resize`).addEventListener('click', async () => {
      this.k.imageMode = 'resize';
      this.k.helpers.showMessage('image mode: resize');
      this.k.resize.resizeNodes(true);
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-resize`).classList.add('active');
    });
    document.getElementById(`${this.k.containerId}-button-crop`).addEventListener('click', async () => {
      this.k.imageMode = 'crop';
      this.k.helpers.showMessage('image mode: crop');
      this.k.resize.resizeNodes(false);
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-crop`).classList.add('active');
    });
    document.getElementById(`${this.k.containerId}-button-text`).addEventListener('click', async () => {
      this.k.imageMode = 'text';
      this.k.helpers.showMessage('image mode: text');
      this.k.resize.resizeNodes(false);
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-text`).classList.add('active');
    });

    // group: paint
    document.getElementById(`${this.k.containerId}-button-paint`).addEventListener('click', async () => {
      this.k.imageMode = 'paint';
      this.k.helpers.showMessage('image mode: paint');
      this.k.paint.startPaint();
      this.k.resize.resizeNodes(false);
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-paint`).classList.add('active');
      document.getElementById(`${this.k.containerId}-paint-controls`).style.display = 'inline';
    });
    document.getElementById(`${this.k.containerId}-brush-size`).addEventListener('input', async (e) => { this.k.paint.brushSize = parseInt((e.target as HTMLInputElement).value, 10); });
    document.getElementById(`${this.k.containerId}-brush-feather`).addEventListener('input', async (e) => { this.k.paint.brushFeather = parseInt((e.target as HTMLInputElement).value, 10); });
    document.getElementById(`${this.k.containerId}-brush-opacity`).addEventListener('input', async (e) => { this.k.paint.brushOpacity = parseFloat((e.target as HTMLInputElement).value); });
    document.getElementById(`${this.k.containerId}-brush-mode`).addEventListener('input', async (e) => { this.k.paint.brushMode = (e.target as HTMLSelectElement).value; });
    document.getElementById(`${this.k.containerId}-brush-color`).addEventListener('input', async (e) => { this.k.paint.brushColor = (e.target as HTMLInputElement).value; });

    // group: filters
    document.getElementById(`${this.k.containerId}-button-filters`).addEventListener('click', async () => {
      this.k.imageMode = 'filters';
      this.k.helpers.showMessage('image mode: filters');
      this.k.resize.resizeNodes(false);
      if (document.getElementById(`${this.k.containerId}-button-filters`).classList.contains('active')) this.k.filter.applyFilter();
      this.resetButtons();
      document.getElementById(`${this.k.containerId}-button-filters`).classList.add('active');
      document.getElementById(`${this.k.containerId}-filter-controls`).style.display = 'inline';
    });
    document.getElementById(`${this.k.containerId}-filter-value`).addEventListener('input', async (e) => { this.k.filter.filterValue = parseInt((e.target as HTMLInputElement).value, 10); });
    document.getElementById(`${this.k.containerId}-filter-name`).addEventListener('input', async (e) => { this.k.filter.filterName = (e.target as HTMLSelectElement).value; });
  }
}
