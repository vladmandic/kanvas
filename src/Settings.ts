import Kanvas from './Kanvas';

const html = `
  <h3>Kanvas Settings</h3>
  <label for="toolbar-size">Allow toolbar Hide:</label>
  <input type="checkbox" id="kanvas-settings-allow-hide" name="kanvas-settings-allow-hide" checked/>
  <br/>
  <label for="toolbar-size">Toolbar size (px):</label>
  <input type="number" id="kanvas-settings-size" name="kanvas-settings-size" min="8" max="48" value="18"/>
  <br/>
  <label for="toolbar-color">Toolbar color (hue):</label>
  <input type="number" id="kanvas-settings-color" name="kanvas-settings-color" min="0" max="360" value="190"/>
  <br/>
  <label for="zoom-lock">Zoom lock:</label>
  <input type="checkbox" id="kanvas-settings-zoom-lock" name="kanvas-settings-zoom-lock"/>
  <br/>
  <label for="message-show">Show messages:</label>
  <input type="checkbox" id="kanvas-settings-message-show" name="kanvas-settings-message-show" checked/>
  <br/>
  <label for="message-timeout">Message timeout (ms):</label>
  <input type="number" id="kanvas-settings-message-timeout" name="kanvas-settings-message-timeout" min="1000" max="20000" value="5000"/>
  <br/>
  <label for="brush-size">Brush size (px):</label>
  <input type="number" id="kanvas-settings-brush-size" name="kanvas-settings-brush-size" min="1" max="100" value="20"/>
`;

export default class Settings {
  k: Kanvas;
  el: HTMLDivElement;
  settings = {
    allowHide: true,
    toolbarSize: 18,
    toolbarColor: 190,
    zoomLock: false,
    messageShow: true,
    messageTimeout: 5000,
    brushSize: 20,
  };

  constructor(k: Kanvas) {
    this.k = k;
    this.readSettings();
    this.el = document.createElement('div');
    this.el.id = `${this.k.containerId}-settings`;
    this.el.className = 'kanvas-settings';
    this.el.innerHTML = html;
    this.k.container.appendChild(this.el);
  }

  setCSS() {
    document.documentElement.style.setProperty('--kanvas-size', `${this.settings.toolbarSize}px`);
    document.documentElement.style.setProperty('--kanvas-color', `${this.settings.toolbarColor}`);
  }

  readSettings() {
    if (window.localStorage) {
      const raw = window.localStorage.getItem('sdnext-kanvas');
      const data = raw ? JSON.parse(raw) : {};
      for (const key in this.settings) {
        if (data[key] !== undefined) this.settings[key] = data[key];
      }
    }
    this.saveSettings();
  }

  saveSettings() {
    if (window.localStorage) window.localStorage.setItem('sdnext-kanvas', JSON.stringify(this.settings));
    this.setCSS();
    if (this.k.resize) this.k.resize.fitStage(this.k.container);
  }

  showSettings() {
    const isVisible = this.el.style.display === 'block';
    if (!isVisible) {
      (document.getElementById('kanvas-settings-allow-hide') as HTMLInputElement).checked = this.settings.allowHide;
      (document.getElementById('kanvas-settings-size') as HTMLInputElement).value = String(this.settings.toolbarSize);
      (document.getElementById('kanvas-settings-color') as HTMLInputElement).value = String(this.settings.toolbarColor);
      (document.getElementById('kanvas-settings-zoom-lock') as HTMLInputElement).checked = this.settings.zoomLock;
      (document.getElementById('kanvas-settings-message-show') as HTMLInputElement).checked = this.settings.messageShow;
      (document.getElementById('kanvas-settings-message-timeout') as HTMLInputElement).value = String(this.settings.messageTimeout);
      (document.getElementById('kanvas-settings-brush-size') as HTMLInputElement).value = String(this.settings.brushSize);
    } else {
      this.settings.allowHide = (document.getElementById('kanvas-settings-allow-hide') as HTMLInputElement).checked;
      this.settings.toolbarSize = parseInt((document.getElementById('kanvas-settings-size') as HTMLInputElement).value, 10);
      this.settings.toolbarColor = parseInt((document.getElementById('kanvas-settings-color') as HTMLInputElement).value, 10);
      this.settings.zoomLock = (document.getElementById('kanvas-settings-zoom-lock') as HTMLInputElement).checked;
      this.settings.messageShow = (document.getElementById('kanvas-settings-message-show') as HTMLInputElement).checked;
      this.settings.messageTimeout = parseInt((document.getElementById('kanvas-settings-message-timeout') as HTMLInputElement).value, 10);
      this.settings.brushSize = parseInt((document.getElementById('kanvas-settings-brush-size') as HTMLInputElement).value, 10);
      this.saveSettings();
    }
    this.el.style.display = isVisible ? 'none' : 'block';
  }

  showInfo() { // eslint-disable-line class-methods-use-this
    window.open('https://vladmandic.github.io/sdnext-docs/Kanvas/', '_blank', '');
  }
}
