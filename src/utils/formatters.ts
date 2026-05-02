export const formatNumber = (num: number | string, maxDecimals = 10): string => {
  if (typeof num === 'string') {
    if (num === '' || num === 'Error') return num;
    num = parseFloat(num);
  }

  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(6);
  }

  const formatted = parseFloat(num.toPrecision(12)).toString();

  if (formatted.includes('.')) {
    const [intPart, decPart] = formatted.split('.');
    if (decPart && decPart.length > maxDecimals) {
      return `${intPart}.${decPart.slice(0, maxDecimals)}`;
    }
  }

  return formatted;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDuration = (days: number): string => {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (remainingDays > 0 || parts.length === 0) {
    parts.push(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);
  }

  return parts.join(', ');
};

export const addCommas = (num: string): string => {
  if (num === '' || num === 'Error') return num;
  const parts = num.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
