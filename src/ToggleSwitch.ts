class ToggleSwitch extends HTMLElement {
  _wrapper: HTMLElement | null;
  _labelOn: HTMLElement | null;
  _labelOff: HTMLElement | null;
  static get observedAttributes() {
    return ['data-on', 'data-off', 'checked', 'disabled'];
  }

  constructor() {
    super();
    const sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host {
          --w: 116px;
          --h: 32px;
          --pad: 4px;
          --track-color: #444;
          --knob-bg: teal;
          display: inline-block;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          outline: none;
          border-radius: 4px;
        }
        :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

        .track {
          position: relative;
          width: calc(var(--w) - 30px);
          height: var(--h);
          background: var(--track-color);
          border-radius: 4px;
          transition: background .18s ease;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* wider knob */
        :host { --k: calc(var(--h) - var(--pad) * 2 + 8px); }
        .knob {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0, -50%);
          width: 50%;
          height: 100%;
          background: var(--knob-bg);
          opacity: 0.5;
          border-radius: 4px;
          transition: transform .18s ease, left .18s ease, background .18s ease;
        }
        :host([checked]) .knob {
          left: 50%;
          transform: translate(0, -50%);
        }

        /* labels inside track */
        .label {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50%;
          font-family: system-ui;
          font-size: 12px;
          color: #fff;
          pointer-events: none;
          padding: 0 4px;
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }
        .label.off { left: 0; }
        .label.on { right: 0; }

        /* active/inactive label colouring */
        :host([checked]) .label.on { color: #fff; font-weight: 600; }
        :host([checked]) .label.off { color: #888; }
        :host(:not([checked])) .label.off { color: #fff; font-weight: 600; }
        :host(:not([checked])) .label.on { color: #888; }
      </style>
      <div class="wrapper" part="wrapper" role="presentation">
        <div class="track" part="track">
          <div class="label off" part="label-off"></div>
          <div class="label on" part="label-on"></div>
          <div class="knob" part="knob" aria-hidden="true"></div>
        </div>
      </div>
    `;

    this._wrapper = sr.querySelector('.wrapper');
    this._labelOn = sr.querySelector('.label.on');
    this._labelOff = sr.querySelector('.label.off');

    // make host focusable and accessible
    this.tabIndex = 0;
    this.setAttribute('role', 'switch');

    this._syncFromAttributes();
    this._updateHost();

    // pointer/keyboard interactions
    this.addEventListener('click', () => {
      if (this.disabled) return;
      this.toggle();
    });

    this.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!this.disabled) this.toggle();
      }
    });
  }

  attributeChangedCallback(name) {
    if (name === 'data-on' || name === 'data-off') {
      this._syncFromAttributes();
    }
    this._updateHost();
  }

  _syncFromAttributes() {
    const onText = this.getAttribute('data-on') || this.dataset.on || 'On';
    const offText = this.getAttribute('data-off') || this.dataset.off || 'Off';
    if (this._labelOn) this._labelOn.textContent = onText;
    if (this._labelOff) this._labelOff.textContent = offText;
  }

  _updateHost() {
    const isChecked = this.hasAttribute('checked');
    const isDisabled = this.hasAttribute('disabled');

    this.setAttribute('aria-checked', isChecked ? 'true' : 'false');
    if (isDisabled) this.setAttribute('aria-disabled', 'true'); else this.removeAttribute('aria-disabled');
  }

  toggle() {
    this.checked = !this.checked;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // properties
  get checked() {
    return this.hasAttribute('checked');
  }
  set checked(val) {
    if (val) this.setAttribute('checked', ''); else this.removeAttribute('checked');
    this._updateHost();
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(val) {
    if (val) this.setAttribute('disabled', ''); else this.removeAttribute('disabled');
    this._updateHost();
  }
}

customElements.define('toggle-switch', ToggleSwitch);
