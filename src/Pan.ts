import Kanvas from './Kanvas';

export default class Pan {
  k: Kanvas;
  constructor(k: Kanvas) {
    this.k = k;
  }

  onMouseMove(evt: MouseEvent) {
    this.k.wrapper.scrollTo(
      this.k.wrapper.scrollLeft - evt.movementX,
      this.k.wrapper.scrollTop - evt.movementY,
    );
  }

  bindPan() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Control') {
        this.k.container.style.cursor = 'default';
        this.k.container.style.cursor = 'grab';
        this.k.container.onmousemove = this.onMouseMove.bind(this);
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Control') {
        this.k.container.style.cursor = 'default';
        this.k.container.onmousemove = null;
      }
    });
  }
}
