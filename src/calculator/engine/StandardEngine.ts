export class StandardEngine {
  protected currentValue: string = "0";
  protected previousValue: string = "";
  protected operator: string | null = null;
  protected shouldResetScreen: boolean = false;
  protected lastOperator: string | null = null;
  protected lastOperand: string | null = null;
  private memoryValue: number = 0;

  get display(): string {
    return this.currentValue;
  }

  get expression(): string {
    if (this.operator && this.previousValue) {
      return `${this.previousValue} ${this.operator}`;
    }
    return "";
  }

  get hasMemory(): boolean {
    return this.memoryValue !== 0;
  }

  private normalizeOperator(op: string): string {
    switch (op) {
      // Common mojibake fallbacks (keep to avoid breaking persisted values)
      case "Ã—":
      case "×":
      case "*":
        return "×";
      case "Ã·":
      case "÷":
      case "/":
        return "÷";
      case "âˆš":
      case "âˆšx":
      case "√":
      case "√x":
        return "√";
      case "xÂ²":
      case "x²":
        return "x²";
      case "1/x":
        return "1/x";
      case "^":
        return "^";
      case "EE":
        return "EE";
      default:
        return op;
    }
  }

  input(digit: string): void {
    if (this.shouldResetScreen) {
      this.currentValue = digit === "." ? "0." : digit;
      this.shouldResetScreen = false;
      return;
    }

    if (this.currentValue === "0" && digit !== ".") {
      this.currentValue = digit;
      return;
    }

    if (digit === "." && this.currentValue.includes(".")) return;

    const numericPart = this.currentValue.replace("-", "").replace(".", "");
    if (numericPart.length >= 15 && digit !== ".") return;

    this.currentValue += digit;
  }

  private unaryOperation(op: string): void {
    const val = parseFloat(this.currentValue);
    if (isNaN(val)) return;

    let result: number;
    switch (op) {
      case "1/x":
        if (val === 0) {
          this.currentValue = "Error";
          this.shouldResetScreen = true;
          return;
        }
        result = 1 / val;
        break;
      case "x²":
        result = val * val;
        break;
      case "√":
        if (val < 0) {
          this.currentValue = "Error";
          this.shouldResetScreen = true;
          return;
        }
        result = Math.sqrt(val);
        break;
      default:
        return;
    }

    this.currentValue = parseFloat(result.toPrecision(12)).toString();
    this.shouldResetScreen = true;
  }

  setOperator(op: string): void {
    const normalized = this.normalizeOperator(op);
    if (normalized === "1/x" || normalized === "x²" || normalized === "√") {
      this.unaryOperation(normalized);
      return;
    }

    if (this.operator && !this.shouldResetScreen) {
      this.calculate();
    }

    this.lastOperator = null;
    this.lastOperand = null;
    this.previousValue = this.currentValue;
    this.operator = normalized;
    this.shouldResetScreen = true;
  }

  calculate(): void {
    if (!this.operator || !this.previousValue) {
      if (this.lastOperator && this.lastOperand) {
        this.operator = this.lastOperator;
        this.previousValue = this.currentValue;
        this.currentValue = this.lastOperand;
        this.doCalculate();
      }
      return;
    }

    this.lastOperator = this.operator;
    this.lastOperand = this.currentValue;
    this.doCalculate();
  }

  private doCalculate(): void {
    if (!this.operator || !this.previousValue) return;

    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
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
          this.previousValue = "";
          this.operator = null;
          this.shouldResetScreen = true;
          return;
        }
        result = prev / current;
        break;
      case "%":
        result = prev % current;
        break;
      case "^":
        result = Math.pow(prev, current);
        break;
      case "EE":
        result = prev * Math.pow(10, current);
        break;
      default:
        return;
    }

    this.currentValue = parseFloat(result.toPrecision(12)).toString();
    this.previousValue = "";
    this.operator = null;
    this.shouldResetScreen = true;
  }

  toggleSign(): void {
    if (this.currentValue === "0" || this.currentValue === "Error") return;
    this.currentValue = this.currentValue.startsWith("-")
      ? this.currentValue.slice(1)
      : "-" + this.currentValue;
  }

  percentage(): void {
    if (this.currentValue === "Error") return;
    const val = parseFloat(this.currentValue);
    if (
      this.previousValue &&
      this.operator &&
      (this.operator === "+" || this.operator === "-")
    ) {
      const prevVal = parseFloat(this.previousValue);
      this.currentValue = ((prevVal * val) / 100).toString();
    } else {
      this.currentValue = (val / 100).toString();
    }
  }

  clear(): void {
    this.currentValue = "0";
    this.previousValue = "";
    this.operator = null;
    this.shouldResetScreen = false;
    this.lastOperator = null;
    this.lastOperand = null;
  }

  clearEntry(): void {
    this.currentValue = "0";
    this.shouldResetScreen = false;
  }

  backspace(): void {
    if (this.currentValue === "Error") {
      this.currentValue = "0";
      return;
    }
    if (this.shouldResetScreen) return;

    if (
      this.currentValue.length === 1 ||
      (this.currentValue.length === 2 && this.currentValue.startsWith("-"))
    ) {
      this.currentValue = "0";
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }
  }

  memoryStore(): void {
    const val = parseFloat(this.currentValue);
    if (!isNaN(val)) this.memoryValue = val;
  }

  memoryRecall(): void {
    this.currentValue = this.memoryValue.toString();
    this.shouldResetScreen = false;
  }

  memoryAdd(): void {
    const val = parseFloat(this.currentValue);
    if (!isNaN(val)) this.memoryValue += val;
  }

  memorySubtract(): void {
    const val = parseFloat(this.currentValue);
    if (!isNaN(val)) this.memoryValue -= val;
  }

  memoryClear(): void {
    this.memoryValue = 0;
  }

  getMemoryValue(): number {
    return this.memoryValue;
  }
}

