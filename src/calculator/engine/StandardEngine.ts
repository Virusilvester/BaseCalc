export class StandardEngine {
  private currentValue: string = '0';
  private previousValue: string = '';
  private operator: string | null = null;
  private shouldResetScreen: boolean = false;

  get display(): string {
    return this.currentValue;
  }

  get expression(): string {
    if (this.operator && this.previousValue) {
      return `${this.previousValue} ${this.operator}`;
    }
    return '';
  }

  input(digit: string): void {
    if (this.shouldResetScreen) {
      this.currentValue = digit;
      this.shouldResetScreen = false;
    } else {
      if (this.currentValue === '0' && digit !== '.') {
        this.currentValue = digit;
      } else if (digit === '.' && this.currentValue.includes('.')) {
        return;
      } else {
        this.currentValue += digit;
      }
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

    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
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
        result = prev / current;
        break;
      case '%':
        result = prev % current;
        break;
    }

    this.currentValue = result.toString();
    this.previousValue = '';
    this.operator = null;
    this.shouldResetScreen = true;
  }

  toggleSign(): void {
    if (this.currentValue === '0') return;
    if (this.currentValue.startsWith('-')) {
      this.currentValue = this.currentValue.slice(1);
    } else {
      this.currentValue = '-' + this.currentValue;
    }
  }

  percentage(): void {
    const val = parseFloat(this.currentValue);
    this.currentValue = (val / 100).toString();
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
    if (this.currentValue.length === 1 || 
        (this.currentValue.length === 2 && this.currentValue.startsWith('-'))) {
      this.currentValue = '0';
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }
  }
}
