import { Vector3 } from './Vector3';

export class Matrix4 {
  public elements: Float32Array;

  constructor() {
    this.elements = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  public identity(): this {
    const te = this.elements;
    te[0] = 1; te[4] = 0; te[8] = 0; te[12] = 0;
    te[1] = 0; te[5] = 1; te[9] = 0; te[13] = 0;
    te[2] = 0; te[6] = 0; te[10] = 1; te[14] = 0;
    te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;
    return this;
  }

  public copy(m: Matrix4): this {
    const me = m.elements;
    const te = this.elements;
    for (let i = 0; i < 16; i++) {
      te[i] = me[i];
    }
    return this;
  }

  public clone(): Matrix4 {
    return new Matrix4().copy(this);
  }

  public multiply(m: Matrix4): this {
    return this.multiplyMatrices(this, m);
  }

  public multiplyMatrices(a: Matrix4, b: Matrix4): this {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

    const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
  }

  public makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): this {
    this.identity();
    const te = this.elements;
    const w = 1.0 / (right - left);
    const h = 1.0 / (top - bottom);
    const p = 1.0 / (far - near);

    const x = (right + left) * w;
    const y = (top + bottom) * h;
    const z = (far + near) * p;

    te[0] = 2 * w;
    te[5] = 2 * h;
    te[10] = -2 * p;
    te[12] = -x;
    te[13] = -y;
    te[14] = -z;

    return this;
  }

  public makePerspective(fov: number, aspect: number, near: number, far: number): this {
    this.identity();
    const te = this.elements;
    const top = near * Math.tan((fov * Math.PI) / 360);
    const bottom = -top;
    const left = bottom * aspect;
    const right = top * aspect;

    const x = (2 * near) / (right - left);
    const y = (2 * near) / (top - bottom);

    const a = (right + left) / (right - left);
    const b = (top + bottom) / (top - bottom);
    const c = -(far + near) / (far - near);
    const d = -(2 * far * near) / (far - near);

    te[0] = x;
    te[5] = y;
    te[8] = a;
    te[9] = b;
    te[10] = c;
    te[11] = -1;
    te[14] = d;
    te[15] = 0;

    return this;
  }

  public lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
    const z = new Vector3().subVectors(eye, target).normalize();
    if (z.lengthSq() === 0) z.z = 1;

    const x = new Vector3().crossVectors(up, z).normalize();
    if (x.lengthSq() === 0) {
      z.x += 0.0001;
      x.crossVectors(up, z).normalize();
    }

    const y = new Vector3().crossVectors(z, x);

    const te = this.elements;
    te[0] = x.x;  te[4] = x.y;  te[8] = x.z;  te[12] = -x.dot(eye);
    te[1] = y.x;  te[5] = y.y;  te[9] = y.z;  te[13] = -y.dot(eye);
    te[2] = z.x;  te[6] = z.y;  te[10] = z.z; te[14] = -z.dot(eye);
    te[3] = 0;    te[7] = 0;    te[11] = 0;    te[15] = 1;

    return this;
  }
}
