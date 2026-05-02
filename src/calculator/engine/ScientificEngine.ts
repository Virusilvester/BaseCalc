import { StandardEngine } from './StandardEngine';

export class ScientificEngine extends StandardEngine {
  private memory: number = 0;
  private angleMode: 'deg' | 'rad' = 'deg';

  get angleModeValue(): 'deg' | 'rad' {
    return this.angleMode;
  }

  toggleAngleMode(): void {
    this.angleMode = this.angleMode === 'deg' ? 'rad' : 'deg';
  }

  private toRadians(degrees: number): number {
    return this.angleMode === 'deg' ? degrees * (Math.PI / 180) : degrees;
  }

  private fromRadians(radians: number): number {
    return this.angleMode === 'deg' ? radians * (180 / Math.PI) : radians;
  }

  scientificOperation(op: string): void {
    const val = parseFloat(this.display);
    let result = 0;

    switch (op) {
      case 'sin':
        result = Math.sin(this.toRadians(val));
        break;
      case 'cos':
        result = Math.cos(this.toRadians(val));
        break;
      case 'tan':
        result = Math.tan(this.toRadians(val));
        break;
      case 'asin':
        result = this.fromRadians(Math.asin(val));
        break;
      case 'acos':
        result = this.fromRadians(Math.acos(val));
        break;
      case 'atan':
        result = this.fromRadians(Math.atan(val));
        break;
      case 'ln':
        result = Math.log(val);
        break;
      case 'log':
        result = Math.log10(val);
        break;
      case '√':
        result = Math.sqrt(val);
        break;
      case 'x²':
        result = val * val;
        break;
      case 'x³':
        result = val * val * val;
        break;
      case '1/x':
        result = 1 / val;
        break;
      case 'eˣ':
        result = Math.exp(val);
        break;
      case '10ˣ':
        result = Math.pow(10, val);
        break;
      case 'x!':
        result = this.factorial(val);
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      case '|x|':
        result = Math.abs(val);
        break;
      case 'floor':
        result = Math.floor(val);
        break;
      case 'ceil':
        result = Math.ceil(val);
        break;
      case 'round':
        result = Math.round(val);
        break;
      case 'rand':
        result = Math.random();
        break;
    }

    // @ts-ignore
    this.currentValue = result.toString();
  }

  power(y: number): void {
    const val = parseFloat(this.display);
    const result = Math.pow(val, y);
    // @ts-ignore
    this.currentValue = result.toString();
  }

  root(y: number): void {
    const val = parseFloat(this.display);
    const result = Math.pow(val, 1 / y);
    // @ts-ignore
    this.currentValue = result.toString();
  }

  private factorial(n: number): number {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  memoryClear(): void {
    this.memory = 0;
  }

  memoryRecall(): void {
    // @ts-ignore
    this.currentValue = this.memory.toString();
  }

  memoryAdd(): void {
    this.memory += parseFloat(this.display);
  }

  memorySubtract(): void {
    this.memory -= parseFloat(this.display);
  }

  memoryStore(): void {
    this.memory = parseFloat(this.display);
  }
}
