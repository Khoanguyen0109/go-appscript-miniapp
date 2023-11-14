import React from "react";
import { TOrder } from "types/order";
import { Box, Text } from "zmp-ui";
import OrderStatus from "./order-status";
import { DisplayPrice } from "components/display/price";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "pages/route";

type Props = {
  item: TOrder;
};

function OrderItem({ item }: Props) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(ROUTES.ORDER_DETAIL(item.id));
  };

  return (
    <Box
      className="rounded-lg bg-background m-4 cursor-pointer"
      onClick={onClick}
    >
      <Box className="flex justify-between py-3 px-4 items-center">
        <OrderStatus status={item.status} />
        <Text className="text-slate-600">
          Ngày đặt: {item.created_at?.split(",")[0] || "20/12/2023"}
        </Text>
      </Box>

      <Box className="px-4 pb-4 mt-2 flex ">
        <img
          className="w-12 h-12 object-cover rounded-2xl mr-3"
          src={
            item?.thumbnail ||
            "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8"
          }
        />
        <Box className="flex-1">
          <Text className="font-bold text-md mb-1">
            {item?.thumbnail_name || "Áo thun đặc biệt"}
          </Text>
          <Box className="flex justify-between">
            <Text className=" text-md">
              <DisplayPrice>{item?.thumbnail_price || "4000000"}</DisplayPrice>
            </Text>
            <Text className="text-gray">{item.item_quantity} sản phẩm</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderItem;
