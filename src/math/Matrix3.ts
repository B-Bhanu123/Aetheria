export class Matrix3 {
  public elements: Float32Array;

  constructor() {
    this.elements = new Float32Array([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);
  }

  public identity(): this {
    const e = this.elements;
    e[0] = 1; e[1] = 0; e[2] = 0;
    e[3] = 0; e[4] = 1; e[5] = 0;
    e[6] = 0; e[7] = 0; e[8] = 1;
    return this;
  }

  public copy(m: Matrix3): this {
    const me = m.elements;
    const te = this.elements;
    for (let i = 0; i < 9; i++) {
      te[i] = me[i];
    }
    return this;
  }

  public clone(): Matrix3 {
    return new Matrix3().copy(this);
  }

  public multiply(m: Matrix3): this {
    return this.multiplyMatrices(this, m);
  }

  public multiplyMatrices(a: Matrix3, b: Matrix3): this {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[0], a12 = ae[3], a13 = ae[6];
    const a21 = ae[1], a22 = ae[4], a23 = ae[7];
    const a31 = ae[2], a32 = ae[5], a33 = ae[8];

    const b11 = be[0], b12 = be[3], b13 = be[6];
    const b21 = be[1], b22 = be[4], b23 = be[7];
    const b31 = be[2], b32 = be[5], b33 = be[8];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  public makeTranslation(x: number, y: number): this {
    this.identity();
    const te = this.elements;
    te[6] = x;
    te[7] = y;
    return this;
  }

  public makeRotation(theta: number): this {
    this.identity();
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const te = this.elements;

    te[0] = c;  te[3] = -s;
    te[1] = s;  te[4] = c;
    return this;
  }

  public makeScale(x: number, y: number): this {
    this.identity();
    const te = this.elements;
    te[0] = x;
    te[4] = y;
    return this;
  }

  public determinant(): number {
    const e = this.elements;
    const a = e[0], b = e[1], c = e[2];
    const d = e[3], f = e[4], g = e[5];
    const h = e[6], i = e[7], j = e[8];

    return a * (f * j - g * i) - b * (d * j - g * h) + c * (d * i - f * h);
  }

  public invert(): this {
    const e = this.elements;
    const n11 = e[0], n21 = e[1], n31 = e[2];
    const n12 = e[3], n22 = e[4], n32 = e[5];
    const n13 = e[6], n23 = e[7], n33 = e[8];

    const t11 = n33 * n22 - n23 * n32;
    const t12 = n23 * n31 - n33 * n21;
    const t13 = n32 * n21 - n22 * n31;

    const det = n11 * t11 + n12 * t12 + n13 * t13;

    if (det === 0) return this.identity();

    const invDet = 1.0 / det;

    e[0] = t11 * invDet;
    e[1] = (n31 * n23 - n21 * n33) * invDet;
    e[2] = (n21 * n32 - n31 * n22) * invDet;

    e[3] = t12 * invDet;
    e[4] = (n11 * n33 - n31 * n13) * invDet;
    e[5] = (n31 * n12 - n11 * n32) * invDet;

    e[6] = t13 * invDet;
    e[7] = (n21 * n13 - n11 * n23) * invDet;
    e[8] = (n11 * n22 - n21 * n12) * invDet;

    return this;
  }
}
