export const CALCULATOR_MODES = [
  { id: 'standard', label: 'Standard', icon: 'calculator' },
  { id: 'scientific', label: 'Scientific', icon: 'flask' },
  { id: 'programmer', label: 'Programmer', icon: 'code-slash' },
  { id: 'date', label: 'Date', icon: 'calendar' },
] as const;

export const CONVERTER_CATEGORIES = [
  { id: 'currency', label: 'Currency', icon: 'cash', color: '#34C759' },
  { id: 'volume', label: 'Volume', icon: 'beaker', color: '#5856D6' },
  { id: 'length', label: 'Length', icon: 'resize', color: '#FF9500' },
  { id: 'weight', label: 'Weight & Mass', icon: 'barbell', color: '#FF3B30' },
  { id: 'temperature', label: 'Temperature', icon: 'thermometer', color: '#FF2D55' },
  { id: 'energy', label: 'Energy', icon: 'flash', color: '#FFCC00' },
  { id: 'area', label: 'Area', icon: 'square', color: '#5AC8FA' },
  { id: 'speed', label: 'Speed', icon: 'speedometer', color: '#AF52DE' },
  { id: 'time', label: 'Time', icon: 'time', color: '#007AFF' },
  { id: 'power', label: 'Power', icon: 'power', color: '#FF6B35' },
  { id: 'data', label: 'Data', icon: 'disc', color: '#64E3C1' },
  { id: 'pressure', label: 'Pressure', icon: 'arrow-down-circle', color: '#A2845E' },
  { id: 'angle', label: 'Angle', icon: 'compass', color: '#0A84FF' },
] as const;

export type CalculatorMode = typeof CALCULATOR_MODES[number]['id'];
export type ConverterCategory = typeof CONVERTER_CATEGORIES[number]['id'];
