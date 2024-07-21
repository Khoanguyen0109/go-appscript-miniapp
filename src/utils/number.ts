export const formatDecimal = (value: number, decimalPlaces: number = 0): string => {
  return value.toLocaleString('vi-VN', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: true,
  });
};