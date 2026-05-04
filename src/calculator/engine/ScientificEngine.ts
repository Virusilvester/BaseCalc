import { StandardEngine } from "./StandardEngine";

export class ScientificEngine extends StandardEngine {
  private angleMode: "deg" | "rad" | "grad" = "deg";
  private isInverse: boolean = false;
  private isHyperbolic: boolean = false;

  get angleModeValue(): "deg" | "rad" | "grad" {
    return this.angleMode;
  }

  get inverseMode(): boolean {
    return this.isInverse;
  }

  get hyperbolicMode(): boolean {
    return this.isHyperbolic;
  }

  toggleAngleMode(): void {
    if (this.angleMode === "deg") this.angleMode = "rad";
    else if (this.angleMode === "rad") this.angleMode = "grad";
    else this.angleMode = "deg";
  }

  toggleInverse(): void {
    this.isInverse = !this.isInverse;
  }

  toggleHyperbolic(): void {
    this.isHyperbolic = !this.isHyperbolic;
  }

  private toRadians(val: number): number {
    if (this.angleMode === "deg") return val * (Math.PI / 180);
    if (this.angleMode === "grad") return val * (Math.PI / 200);
    return val;
  }

  private fromRadians(val: number): number {
    if (this.angleMode === "deg") return val * (180 / Math.PI);
    if (this.angleMode === "grad") return val * (200 / Math.PI);
    return val;
  }

  private formatResult(result: number): string {
    if (isNaN(result)) return "Error";
    if (!isFinite(result)) return result > 0 ? "Infinity" : "-Infinity";
    return parseFloat(result.toPrecision(12)).toString();
  }

  private normalizeOp(op: string): string {
    switch (op) {
      // mojibake fallbacks
      case "Ï€":
        return "π";
      case "Ï†":
        return "φ";
      case "âˆš":
        return "√";
      case "âˆ›":
        return "∛";
      case "xÂ²":
        return "x²";
      case "xÂ³":
        return "x³";
      case "eË£":
        return "eˣ";
      case "10Ë£":
        return "10ˣ";
      case "2Ë£":
        return "2ˣ";
      default:
        return op;
    }
  }

  scientificOperation(op: string): void {
    const normalized = this.normalizeOp(op);
    const val = parseFloat(this.display);

    if (isNaN(val) && !["π", "e", "φ", "rand"].includes(normalized)) {
      this.currentValue = "Error";
      return;
    }

    let result = 0;

    switch (normalized) {
      case "sin":
        result = this.isHyperbolic
          ? this.isInverse
            ? Math.asinh(val)
            : Math.sinh(val)
          : this.isInverse
            ? this.fromRadians(Math.asin(val))
            : Math.sin(this.toRadians(val));
        break;
      case "cos":
        result = this.isHyperbolic
          ? this.isInverse
            ? Math.acosh(val)
            : Math.cosh(val)
          : this.isInverse
            ? this.fromRadians(Math.acos(val))
            : Math.cos(this.toRadians(val));
        break;
      case "tan":
        result = this.isHyperbolic
          ? this.isInverse
            ? Math.atanh(val)
            : Math.tanh(val)
          : this.isInverse
            ? this.fromRadians(Math.atan(val))
            : Math.tan(this.toRadians(val));
        break;
      case "ln":
        if (val <= 0) {
          this.currentValue = "Error";
          return;
        }
        result = this.isInverse ? Math.exp(val) : Math.log(val);
        break;
      case "log":
        if (val <= 0) {
          this.currentValue = "Error";
          return;
        }
        result = this.isInverse ? Math.pow(10, val) : Math.log10(val);
        break;
      case "log2":
        if (val <= 0) {
          this.currentValue = "Error";
          return;
        }
        result = Math.log2(val);
        break;
      case "√":
        if (val < 0) {
          this.currentValue = "Error";
          return;
        }
        result = this.isInverse ? val * val : Math.sqrt(val);
        break;
      case "∛":
        result = Math.cbrt(val);
        break;
      case "x²":
        result = this.isInverse
          ? Math.sqrt(Math.abs(val)) * Math.sign(val)
          : val * val;
        break;
      case "x³":
        result = this.isInverse ? Math.cbrt(val) : val * val * val;
        break;
      case "1/x":
        if (val === 0) {
          this.currentValue = "Error";
          return;
        }
        result = 1 / val;
        break;
      case "eˣ":
        result = Math.exp(val);
        break;
      case "10ˣ":
        result = Math.pow(10, val);
        break;
      case "2ˣ":
        result = Math.pow(2, val);
        break;
      case "x!":
        if (val < 0 || val > 170 || !Number.isInteger(val)) {
          this.currentValue =
            val < 0 || !Number.isInteger(val) ? "Error" : "Overflow";
          return;
        }
        result = this.factorial(val);
        break;
      case "π":
        result = Math.PI;
        break;
      case "e":
        result = Math.E;
        break;
      case "φ":
        result = (1 + Math.sqrt(5)) / 2;
        break;
      case "|x|":
        result = Math.abs(val);
        break;
      case "floor":
        result = Math.floor(val);
        break;
      case "ceil":
        result = Math.ceil(val);
        break;
      case "round":
        result = Math.round(val);
        break;
      case "rand":
        result = Math.random();
        break;
      case "EE":
        this.setOperator("EE");
        return;
      default:
        return;
    }

    this.currentValue = this.formatResult(result);
    this.shouldResetScreen = true;
  }

  power(y: number): void {
    const val = parseFloat(this.display);
    const result = Math.pow(val, y);
    this.currentValue = this.formatResult(result);
    this.shouldResetScreen = true;
  }

  root(y: number): void {
    const val = parseFloat(this.display);
    if (val < 0 && y % 2 === 0) {
      this.currentValue = "Error";
      return;
    }
    const result = Math.pow(val, 1 / y);
    this.currentValue = this.formatResult(result);
    this.shouldResetScreen = true;
  }

  private factorial(n: number): number {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }
}
