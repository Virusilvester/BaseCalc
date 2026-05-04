export class ProgrammerEngine {
  private currentValue: string = "0";
  private previousValue: string = "";
  private operator: string | null = null;
  private shouldResetScreen: boolean = false;
  private base: number = 10;
  private bitWidth: 64 | 32 | 16 | 8 = 32;
  private isSigned: boolean = true;

  get display(): string {
    return this.currentValue;
  }

  get expression(): string {
    if (this.operator && this.previousValue) {
      return `${this.previousValue} ${this.operator}`;
    }
    return "";
  }

  get currentBase(): number {
    return this.base;
  }

  get currentBitWidth(): number {
    return this.bitWidth;
  }

  get signedMode(): boolean {
    return this.isSigned;
  }

  private normalizeOperator(op: string): string {
    switch (op) {
      case "Ã—":
      case "×":
      case "*":
        return "×";
      case "Ã·":
      case "÷":
      case "/":
        return "÷";
      default:
        return op;
    }
  }

  setBase(newBase: number): void {
    const decimalValue = this.toDecimal(this.currentValue);
    this.base = newBase;
    if (decimalValue !== null) {
      this.currentValue = this.fromDecimal(decimalValue);
    }
  }

  setBitWidth(width: 64 | 32 | 16 | 8): void {
    this.bitWidth = width;
    const val = this.toDecimal(this.currentValue);
    if (val !== null) {
      this.currentValue = this.fromDecimal(this.applyBitWidth(val));
    }
  }

  private toDecimal(str: string): number | null {
    if (str === "Error") return null;
    const val = parseInt(str, this.base);
    return isNaN(val) ? null : val;
  }

  private fromDecimal(val: number): string {
    if (val < 0) {
      if (this.isSigned) {
        return "-" + Math.abs(val).toString(this.base).toUpperCase();
      }
    }
    return val.toString(this.base).toUpperCase();
  }

  private applyBitWidth(val: number): number {
    const bits = this.bitWidth;
    if (bits === 64) return val;

    const mask = (1 << bits) - 1;
    val = val & mask;
    if (this.isSigned && bits < 64) {
      const signBit = 1 << (bits - 1);
      if (val & signBit) {
        val = val - (1 << bits);
      }
    }
    return val;
  }

  input(digit: string): void {
    const validChars = this.getValidChars();
    if (!validChars.includes(digit.toUpperCase())) return;

    if (this.shouldResetScreen) {
      this.currentValue = digit.toUpperCase();
      this.shouldResetScreen = false;
      return;
    }

    const raw = this.currentValue.replace("-", "");
    const maxDigits = Math.ceil(this.bitWidth / Math.log2(this.base));
    if (raw.length >= maxDigits && digit !== "0") return;

    if (this.currentValue === "0") {
      this.currentValue = digit.toUpperCase();
    } else {
      this.currentValue += digit.toUpperCase();
    }
  }

  private getValidChars(): string {
    switch (this.base) {
      case 2:
        return "01";
      case 8:
        return "01234567";
      case 10:
        return "0123456789";
      case 16:
        return "0123456789ABCDEF";
      default:
        return "0123456789";
    }
  }

  setOperator(op: string): void {
    const normalized = this.normalizeOperator(op);
    if (this.operator && !this.shouldResetScreen) {
      this.calculate();
    }
    this.previousValue = this.currentValue;
    this.operator = normalized;
    this.shouldResetScreen = true;
  }

  calculate(): void {
    if (!this.operator || !this.previousValue) return;

    const prev = this.toDecimal(this.previousValue);
    const current = this.toDecimal(this.currentValue);

    if (prev === null || current === null) {
      this.currentValue = "Error";
      this.resetState();
      return;
    }

    let result = 0;

    switch (this.operator) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "×":
        result = prev * current;
        break;
      case "÷":
        if (current === 0) {
          this.currentValue = "Error";
          this.resetState();
          return;
        }
        result = Math.trunc(prev / current);
        break;
      case "MOD":
        result = prev % current;
        break;
      case "AND":
        result = prev & current;
        break;
      case "OR":
        result = prev | current;
        break;
      case "XOR":
        result = prev ^ current;
        break;
      case "NOR":
        result = ~(prev | current);
        break;
      case "NAND":
        result = ~(prev & current);
        break;
      case "<<":
        result = prev << current;
        break;
      case ">>":
        result = prev >> current;
        break;
      case ">>>":
        result = prev >>> current;
        break;
      default:
        return;
    }

    result = this.applyBitWidth(result);
    this.currentValue = this.fromDecimal(result);
    this.resetState();
  }

  private resetState(): void {
    this.previousValue = "";
    this.operator = null;
    this.shouldResetScreen = true;
  }

  bitwiseNot(): void {
    const val = this.toDecimal(this.currentValue);
    if (val === null) return;
    const result = this.applyBitWidth(~val);
    this.currentValue = this.fromDecimal(result);
  }

  leftShift(): void {
    const val = this.toDecimal(this.currentValue);
    if (val === null) return;
    const result = this.applyBitWidth(val << 1);
    this.currentValue = this.fromDecimal(result);
  }

  rightShift(): void {
    const val = this.toDecimal(this.currentValue);
    if (val === null) return;
    const result = this.applyBitWidth(val >> 1);
    this.currentValue = this.fromDecimal(result);
  }

  clear(): void {
    this.currentValue = "0";
    this.previousValue = "";
    this.operator = null;
    this.shouldResetScreen = false;
  }

  clearEntry(): void {
    this.currentValue = "0";
  }

  backspace(): void {
    if (this.currentValue === "Error") {
      this.currentValue = "0";
      return;
    }
    if (this.currentValue.length === 1 || this.currentValue === "-0") {
      this.currentValue = "0";
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }
  }

  getAllBases(): { base: number; label: string; value: string }[] {
    const decimal = this.toDecimal(this.currentValue);
    if (decimal === null) return [];

    const absVal = Math.abs(decimal);
    const sign = decimal < 0 ? "-" : "";

    return [
      {
        base: 16,
        label: "HEX",
        value: sign + absVal.toString(16).toUpperCase(),
      },
      { base: 10, label: "DEC", value: decimal.toString(10) },
      { base: 8, label: "OCT", value: sign + absVal.toString(8) },
      { base: 2, label: "BIN", value: sign + absVal.toString(2) },
    ];
  }

  getBitView(): boolean[] {
    const decimal = this.toDecimal(this.currentValue);
    if (decimal === null) return Array(this.bitWidth).fill(false);

    const bits: boolean[] = [];
    const mask =
      this.bitWidth === 64 ? Number.MAX_SAFE_INTEGER : (1 << this.bitWidth) - 1;
    const val = decimal & mask;

    for (let i = this.bitWidth - 1; i >= 0; i--) {
      bits.push((val & (1 << i)) !== 0);
    }
    return bits;
  }
}
