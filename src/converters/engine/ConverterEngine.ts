import { conversionData, Unit } from '../data/conversionData';

export class ConverterEngine {
  private categoryId: string;
  private fromUnit: string;
  private toUnit: string;

  constructor(categoryId: string, fromUnit: string, toUnit: string) {
    this.categoryId = categoryId;
    this.fromUnit = fromUnit;
    this.toUnit = toUnit;
  }

  setCategory(categoryId: string): void {
    this.categoryId = categoryId;
    const category = conversionData[categoryId];
    if (category) {
      this.fromUnit = category.units[0].id;
      this.toUnit = category.units[1]?.id || category.units[0].id;
    }
  }

  setFromUnit(unitId: string): void {
    this.fromUnit = unitId;
  }

  setToUnit(unitId: string): void {
    this.toUnit = unitId;
  }

  convert(value: number): number {
    const category = conversionData[this.categoryId];
    if (!category) return value;

    const from = category.units.find(u => u.id === this.fromUnit);
    const to = category.units.find(u => u.id === this.toUnit);

    if (!from || !to) return value;

    if (this.categoryId === 'temperature') {
      return this.convertTemperature(value, from, to);
    }

    const baseValue = value * from.toBase;
    return baseValue / to.toBase;
  }

  private convertTemperature(value: number, from: Unit, to: Unit): number {
    let celsius: number;

    if (from.id === 'c') {
      celsius = value;
    } else if (from.id === 'f') {
      celsius = (value - 32) * 5 / 9;
    } else if (from.id === 'k') {
      celsius = value - 273.15;
    } else if (from.id === 'r') {
      celsius = (value - 491.67) * 5 / 9;
    } else {
      celsius = value;
    }

    if (to.id === 'c') {
      return celsius;
    } else if (to.id === 'f') {
      return celsius * 9 / 5 + 32;
    } else if (to.id === 'k') {
      return celsius + 273.15;
    } else if (to.id === 'r') {
      return (celsius + 273.15) * 9 / 5;
    }

    return celsius;
  }

  getUnits(): Unit[] {
    const category = conversionData[this.categoryId];
    return category?.units || [];
  }

  getCategoryLabel(): string {
    const category = conversionData[this.categoryId];
    return category?.label || '';
  }

  swapUnits(): void {
    const temp = this.fromUnit;
    this.fromUnit = this.toUnit;
    this.toUnit = temp;
  }
}
