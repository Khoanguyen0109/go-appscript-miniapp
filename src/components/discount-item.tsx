import React from "react";
import { TDiscount } from "../types/discount";
import { Box, Button, Text } from "zmp-ui";

type Props = {
  item: TDiscount;
  onClickRedeem?: (item: TDiscount) => void;
  onChoose?: (item: TDiscount) => void;
  onUpdateItem?: () => void;
};

function DiscountItem({ item, onClickRedeem, onChoose, onUpdateItem }: Props) {
  return (
    <Box className="w-full  rounded-md shadow-lg mb-3 overflow-hidden">
      <img src={item?.panel} className="w-full h-32 object-cover" />
      <Box className="p-2 flex justify-between items-end">
        <Box className="">
          <Text className="text-lg font-bold">{item?.title}</Text>

          {!item?.public && (
            <Text className="font-semibold text-sm  text-yellow-500">
              {item?.point || 0} Xu Mion
            </Text>
          )}
        </Box>
        {onClickRedeem && (
          <Button size="small" onClick={() => onClickRedeem(item)}>
            Đổi voucher
          </Button>
        )}
        {onChoose && (
          <Button
            size="small"
            onClick={() => {
              onChoose(item);
              onUpdateItem && onUpdateItem();
            }}
          >
            Sử dụng
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default DiscountItem;
