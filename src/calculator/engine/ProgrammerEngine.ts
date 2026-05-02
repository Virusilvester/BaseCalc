export class ProgrammerEngine {
  private currentValue: string = '0';
  private previousValue: string = '';
  private operator: string | null = null;
  private shouldResetScreen: boolean = false;
  private base: number = 10;
  private bitWidth: 64 | 32 | 16 | 8 = 64;

  get display(): string {
    return this.currentValue;
  }

  get expression(): string {
    if (this.operator && this.previousValue) {
      return `${this.previousValue} ${this.operator}`;
    }
    return '';
  }

  get currentBase(): number {
    return this.base;
  }

  get currentBitWidth(): number {
    return this.bitWidth;
  }

  setBase(newBase: number): void {
    const decimalValue = parseInt(this.currentValue, this.base);
    this.base = newBase;
    if (!isNaN(decimalValue)) {
      this.currentValue = decimalValue.toString(this.base).toUpperCase();
    }
  }

  setBitWidth(width: 64 | 32 | 16 | 8): void {
    this.bitWidth = width;
    const decimalValue = parseInt(this.currentValue, this.base);
    if (!isNaN(decimalValue)) {
      const maxVal = Math.pow(2, width) - 1;
      const maskedVal = decimalValue & maxVal;
      this.currentValue = maskedVal.toString(this.base).toUpperCase();
    }
  }

  input(digit: string): void {
    const validChars = this.getValidChars();
    if (!validChars.includes(digit.toUpperCase())) return;

    if (this.shouldResetScreen) {
      this.currentValue = digit;
      this.shouldResetScreen = false;
    } else {
      if (this.currentValue === '0' && digit !== '0') {
        this.currentValue = digit.toUpperCase();
      } else {
        this.currentValue += digit.toUpperCase();
      }
    }
  }

  private getValidChars(): string {
    switch (this.base) {
      case 2: return '01';
      case 8: return '01234567';
      case 10: return '0123456789';
      case 16: return '0123456789ABCDEF';
      default: return '0123456789';
    }
  }

  setOperator(op: string): void {
    if (this.operator && !this.shouldResetScreen) {
      this.calculate();
    }
    this.previousValue = this.currentValue;
    this.operator = op;
    this.shouldResetScreen = true;
  }

  calculate(): void {
    if (!this.operator || !this.previousValue) return;

    const prev = parseInt(this.previousValue, this.base);
    const current = parseInt(this.currentValue, this.base);
    let result = 0;

    switch (this.operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        if (current === 0) {
          this.currentValue = 'Error';
          this.previousValue = '';
          this.operator = null;
          this.shouldResetScreen = true;
          return;
        }
        result = Math.floor(prev / current);
        break;
      case 'AND':
        result = prev & current;
        break;
      case 'OR':
        result = prev | current;
        break;
      case 'XOR':
        result = prev ^ current;
        break;
      case 'NOR':
        result = ~(prev | current);
        break;
      case '<<':
        result = prev << current;
        break;
      case '>>':
        result = prev >> current;
        break;
    }

    const maxVal = Math.pow(2, this.bitWidth) - 1;
    result = result & maxVal;

    this.currentValue = result.toString(this.base).toUpperCase();
    this.previousValue = '';
    this.operator = null;
    this.shouldResetScreen = true;
  }

  bitwiseNot(): void {
    const val = parseInt(this.currentValue, this.base);
    const maxVal = Math.pow(2, this.bitWidth) - 1;
    const result = (~val) & maxVal;
    this.currentValue = result.toString(this.base).toUpperCase();
  }

  clear(): void {
    this.currentValue = '0';
    this.previousValue = '';
    this.operator = null;
    this.shouldResetScreen = false;
  }

  clearEntry(): void {
    this.currentValue = '0';
  }

  backspace(): void {
    if (this.currentValue.length === 1) {
      this.currentValue = '0';
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }
  }

  getAllBases(): { base: number; label: string; value: string }[] {
    const decimal = parseInt(this.currentValue, this.base);
    if (isNaN(decimal)) return [];

    return [
      { base: 2, label: 'BIN', value: decimal.toString(2) },
      { base: 8, label: 'OCT', value: decimal.toString(8) },
      { base: 10, label: 'DEC', value: decimal.toString(10) },
      { base: 16, label: 'HEX', value: decimal.toString(16).toUpperCase() },
    ];
  }
}
