import { getConfig } from "./config";

export const formatPrice = (prize) => {
  const symbol = getConfig((config) => config.template.currencySymbol);
  const format = new Intl.NumberFormat().format(parseFloat(prize.toString()));
  return `${format}${symbol}`;
};
