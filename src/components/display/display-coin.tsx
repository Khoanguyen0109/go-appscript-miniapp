import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { getConfig } from "../../utils/config";

export const DisplayCoin: FC<{ children: number | string }> = ({
  children,
}) => {
  const symbol = "M";
  const format = new Intl.NumberFormat().format(
    parseFloat(children.toString())
  );
  const currency = getConfig((config) => config.template.currencySymbol);

  return (
    <Box>
      <Text className="font-bold text-lg">
        {format}
        {symbol}
      </Text>
      <Text className="text-sm">
        {new Intl.NumberFormat().format(
          parseFloat((children * 100).toString())
        )}
        {currency}
      </Text>
    </Box>
  );
};
