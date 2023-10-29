import React, { FC } from "react";
import { getConfig } from "utils/config";

export const DisplayPrice: FC<{ children: number | string }> = ({
  children,
}) => {
  const symbol = getConfig((config) => config.template.currencySymbol);
  const format = new Intl.NumberFormat().format(
    parseFloat(children.toLocaleString())
  );
  if (getConfig((config) => config.template.prefixCurrencySymbol)) {
    return (
      <>
        {symbol}
        {format}
      </>
    );
  } else {
    return (
      <>
        {format}
        {symbol}
      </>
    );
  }
};
