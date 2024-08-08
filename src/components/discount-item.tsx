import React from "react";
import { Box, Button, Text } from "zmp-ui";
import { TDiscount } from "../types/discount";

type Props = {
  item: TDiscount;
  onClickRedeem?: (item: TDiscount) => void;
  onChoose?: (item: TDiscount) => void;
  onUpdateItem?: () => void;
};

function DiscountItem({ item, onClickRedeem, onChoose, onUpdateItem }: Props) {
  return (
    <Box className="w-full  rounded-md shadow-lg mb-3 overflow-hidden">
      <img
        src={item?.thumbnail}
        className="w-full h-36 object-cover"
        alt={"voucher"}
        referrerPolicy="no-referrer"
      />
      <Box className="p-2 flex justify-between items-end">
        <Box className="">
          <Text className="text-lg font-bold">{item?.title}</Text>

          {!item?.public && (
            <Text className="font-semibold text-sm  text-green">
              {item?.point || 0} Xu
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
