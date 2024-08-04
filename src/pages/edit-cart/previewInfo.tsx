import { DisplayPrice } from "components/display/price";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import {
  discountState,
  preTotalPriceEditCartState,
  shippingFeeState,
} from "state";
import { Box, Text } from "zmp-ui";

export default function EditCartPreviewInfo() {
  const preTotal = useRecoilValue(preTotalPriceEditCartState);

  return (
    <Box className="px-2">
      <Box className="flex justify-between items-center mb-2">
        <Text className="font-bold">Tạm tính</Text>
        <Text>
          <DisplayPrice>{preTotal}</DisplayPrice>
        </Text>
      </Box>
    </Box>
  );
}
