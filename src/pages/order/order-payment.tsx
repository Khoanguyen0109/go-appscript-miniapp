import React from "react";
import { TOrder } from "types/order";
import { Box, Text } from "zmp-ui";

type Props = {
  item: TOrder;
};

function OrderPayment({ item }: Props) {
  return (
    <Box className="p-4">
      <Text.Title className="mb-4">Thông tin thanh toán</Text.Title>
    </Box>
  );
}

export default OrderPayment;
