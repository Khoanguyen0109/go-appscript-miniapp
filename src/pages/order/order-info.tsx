import { ListRenderer } from "components/list-renderer";
import React from "react";
import { TOrder } from "types/order";
import { Box, Text } from "zmp-ui";
import OrderStatus from "./order-status";

type Props = {
  item: TOrder;
};

function OrderInfo({ item }: Props) {
  return (
    <Box className="p-4">
      <Text.Title className="mb-4">Thông tin đơn hàng</Text.Title>

      <ListRenderer
        items={[
          {
            left: <Box></Box>,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Mã đơn hàng
                </Text.Header>
                <Text>{item.id}</Text>
              </Box>
            ),
          },
          {
            left: <Box></Box>,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Ngày đặt hàng
                </Text.Header>
                <Text>{item.created_at}</Text>
              </Box>
            ),
          },
          {
            left: <Box></Box>,
            right: (
              <Box flex className="items-center">
                <Text.Header className="flex-1 items-center font-normal">
                  Trạng thái
                </Text.Header>
                <OrderStatus status={item.status} />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
}

export default OrderInfo;
