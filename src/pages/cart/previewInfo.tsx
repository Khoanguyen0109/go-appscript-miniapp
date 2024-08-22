import { DisplayPrice } from "components/display/price";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import {
  calDiscount,
  discountState,
  preTotalPriceState,
  shippingFeeState,
} from "state";
import { Box, Text } from "zmp-ui";

function PreviewInfo() {
  const preTotal = useRecoilValue(preTotalPriceState);
  const discount = useRecoilValue(discountState);
  const shippingFee = useRecoilValue(shippingFeeState);

  return (
    <Box className="px-2">
      <Box className="flex justify-between items-center mb-2">
        <Text className="font-bold">Tạm tính</Text>
        <Text>
          <DisplayPrice>{preTotal}</DisplayPrice>
        </Text>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <Text className="font-bold">Phí vận chuyển</Text>
        <Text>
          <DisplayPrice>{shippingFee}</DisplayPrice>
        </Text>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <Text className="font-bold">Giảm giá</Text>
        <Text className="text-green">
          -<DisplayPrice>{calDiscount(discount, preTotal)}</DisplayPrice>
        </Text>
      </Box>
    </Box>
  );
}

export default PreviewInfo;
