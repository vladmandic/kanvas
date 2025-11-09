/**
 * Do not modify the source canvas. Return four canvases (top, bottom, left, right)
 * where transparent pixels have been filled from the nearest non-transparent pixel
 * when looking strictly in the given direction:
 *  - top: source pixels must be above (smaller y)
 *  - bottom: source pixels must be below (larger y)
 *  - left: source pixels must be to the left (smaller x)
 *  - right: source pixels must be to the right (larger x)
 *
 * Original non-transparent pixels are left transparent in returned canvases (so
 * each returned canvas contains only filled pixels).
 *
 * @param canvas source HTMLCanvasElement (not modified)
 * @param alphaThreshold treat pixels with alpha <= threshold as "transparent" (0-255)
 * @returns object with canvases: { top, bottom, left, right }
 */
export function fillTransparent(canvas: HTMLCanvasElement, alphaThreshold = 0): {
  top: HTMLCanvasElement;
  bottom: HTMLCanvasElement;
  left: HTMLCanvasElement;
  right: HTMLCanvasElement;
} {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const empty = document.createElement('canvas');
    return { top: empty, bottom: empty, left: empty, right: empty };
  }

  const w = canvas.width;
  const h = canvas.height;
  if (w === 0 || h === 0) {
    const empty = document.createElement('canvas');
    empty.width = w;
    empty.height = h;
    return { top: empty, bottom: empty, left: empty, right: empty };
  }

  const src = ctx.getImageData(0, 0, w, h);
  const sdata = src.data; // Uint8ClampedArray
  const total = w * h;

  // prepare output buffers (initialized transparent)
  const topBuf = new Uint8ClampedArray(total * 4);
  const bottomBuf = new Uint8ClampedArray(total * 4);
  const leftBuf = new Uint8ClampedArray(total * 4);
  const rightBuf = new Uint8ClampedArray(total * 4);

  // helper to write color into output buffer at pixel index p (byte offset)
  const writePixel = (buf: Uint8ClampedArray, p: number, r: number, g: number, b: number, a: number) => {
    buf[p] = r; // eslint-disable-line no-param-reassign
    buf[p + 1] = g; // eslint-disable-line no-param-reassign
    buf[p + 2] = b; // eslint-disable-line no-param-reassign
    buf[p + 3] = a; // eslint-disable-line no-param-reassign
  };

  // TOP: scan columns top->bottom, propagate last seen non-transparent color downward
  for (let x = 0; x < w; ++x) {
    let lastR = 0;
    let lastG = 0;
    let lastB = 0;
    let lastA = 0;
    let haveLast = false;
    for (let y = 0; y < h; ++y) {
      const idx = (y * w + x) * 4;
      const a = sdata[idx + 3];
      if (a > alphaThreshold) {
        // source pixel: update last, but we DO NOT copy source into outputs (leave them transparent)
        lastR = sdata[idx];
        lastG = sdata[idx + 1];
        lastB = sdata[idx + 2];
        lastA = a;
        haveLast = true;
      } else if (haveLast) {
        // fill this transparent pixel with last seen color
        writePixel(topBuf, idx, lastR, lastG, lastB, lastA !== 0 ? lastA : 255);
      }
    }
  }

  // BOTTOM: scan columns bottom->top, propagate last seen non-transparent upward
  for (let x = 0; x < w; ++x) {
    let lastR = 0;
    let lastG = 0;
    let lastB = 0;
    let lastA = 0;
    let haveLast = false;
    for (let y = h - 1; y >= 0; --y) {
      const idx = (y * w + x) * 4;
      const a = sdata[idx + 3];
      if (a > alphaThreshold) {
        lastR = sdata[idx];
        lastG = sdata[idx + 1];
        lastB = sdata[idx + 2];
        lastA = a;
        haveLast = true;
      } else if (haveLast) {
        writePixel(bottomBuf, idx, lastR, lastG, lastB, lastA !== 0 ? lastA : 255);
      }
    }
  }

  // LEFT: scan rows left->right, propagate last seen non-transparent to the right
  for (let y = 0; y < h; ++y) {
    let lastR = 0;
    let lastG = 0;
    let lastB = 0;
    let lastA = 0;
    let haveLast = false;
    const rowBase = y * w;
    for (let x = 0; x < w; ++x) {
      const idx = (rowBase + x) * 4;
      const a = sdata[idx + 3];
      if (a > alphaThreshold) {
        lastR = sdata[idx];
        lastG = sdata[idx + 1];
        lastB = sdata[idx + 2];
        lastA = a;
        haveLast = true;
      } else if (haveLast) {
        writePixel(leftBuf, idx, lastR, lastG, lastB, lastA !== 0 ? lastA : 255);
      }
    }
  }

  // RIGHT: scan rows right->left, propagate last seen non-transparent to the left
  for (let y = 0; y < h; ++y) {
    let lastR = 0;
    let lastG = 0;
    let lastB = 0;
    let lastA = 0;
    let haveLast = false;
    const rowBase = y * w;
    for (let x = w - 1; x >= 0; --x) {
      const idx = (rowBase + x) * 4;
      const a = sdata[idx + 3];
      if (a > alphaThreshold) {
        lastR = sdata[idx];
        lastG = sdata[idx + 1];
        lastB = sdata[idx + 2];
        lastA = a;
        haveLast = true;
      } else if (haveLast) {
        writePixel(rightBuf, idx, lastR, lastG, lastB, lastA !== 0 ? lastA : 255);
      }
    }
  }

  // create canvases and put image data
  const makeCanvasFromBuf = (buf: ImageDataArray) => { // eslint-disable-line no-undef
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    const oc = out.getContext('2d');
    if (!oc) return out;
    const img = new ImageData(buf, w, h);
    oc.putImageData(img, 0, 0);
    return out;
  };

  const topCanvas = makeCanvasFromBuf(topBuf);
  const bottomCanvas = makeCanvasFromBuf(bottomBuf);
  const leftCanvas = makeCanvasFromBuf(leftBuf);
  const rightCanvas = makeCanvasFromBuf(rightBuf);

  return { top: topCanvas, bottom: bottomCanvas, left: leftCanvas, right: rightCanvas };
}
