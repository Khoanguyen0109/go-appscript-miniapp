import React from "react";
import { Box, Icon, List, Text } from "zmp-ui";
import OrderItem from "./order-item";
import { TOrder } from "types/order";
const { Item } = List;

type Props = {
  orders: TOrder[];
};

function OrderList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <Box className="text-center">
        <Text
          className="bg-background rounded-xl py-8 px-4 text-center text-gray"
          size="xxSmall"
        >
          Không có đơn hàng
        </Text>
        <Icon
          size={40}
          icon="zi-bookmark-delete"
        ></Icon>
      </Box>
    );
  }
  return (
    <Box className="bg-devider_1 min-h-screen overflow-y-auto">
      {orders.map((item) => (
        <OrderItem key={item.id} item={item} />
      ))}
    </Box>
  );
}

export default OrderList;
