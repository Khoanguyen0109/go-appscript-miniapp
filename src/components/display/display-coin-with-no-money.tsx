import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { getConfig } from "../../utils/config";

export const DisplayCoinNoMoney: FC<{ children: number | string }> = ({
  children,
}) => {
  const symbol = " Xu Mion";
  const format = new Intl.NumberFormat().format(
    parseFloat(children.toString())
  );

  return (
    <Box>
      <Text className="font-bold text-lg">
        {format}
        {symbol}
      </Text>
    </Box>
  );
};
