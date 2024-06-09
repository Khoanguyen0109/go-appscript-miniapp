import React from "react";
import { TDiscount } from "../types/discount";
import { Box, Button, Text } from "zmp-ui";

type Props = {
  item: TDiscount;
  onClickRedeem?: (item: TDiscount) => void;
  onChoose?: (item: TDiscount) => void;
};

function DiscountItem({ item, onClickRedeem, onChoose }: Props) {
  return (
    <Box className="w-full  rounded-md shadow-lg mb-3 overflow-hidden">
      <img src={item.panel} className="w-full h-32 object-cover" />
      <Box className="p-2 flex justify-between items-end">
        <Box className="">
          <Text className="text-lg font-bold">{item.title}</Text>

          {!item.public && (
            <Text className="font-semibold text-sm  text-yellow-500">
              {item.point} Xu Mion
            </Text>
          )}
        </Box>
        {onClickRedeem && (
          <Button size="small" onClick={() => onClickRedeem(item)}>
            Đổi voucher
          </Button>
        )}
        {onChoose && (
          <Button size="small" onClick={() => onChoose(item)}>
            Sử dụng
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default DiscountItem;
