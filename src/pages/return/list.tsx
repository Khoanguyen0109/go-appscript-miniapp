import React, { useEffect, useRef, useState } from "react";
import { TOrder } from "types/order";
import { Box, Icon, Text, useSnackbar } from "zmp-ui";
import ReturnItem from "./item";


type Props = {
  orders: TOrder[];
};

function ReturnHistoryList({ orders }: Props) {
  const [orderSelected, setOrderSelected] = useState();
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
  const timmerId = useRef();
  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );
  const onOpenRating = (id) => {
    // setOpenModal(true);
    setOrderSelected(id);
  };

  if (orders.length === 0) {
    return (
      <Box className="text-center mt-4">
        <Text
          className="bg-background rounded-xl py-8 px-2 text-center text-gray"
          size="xxSmall"
        >
          Không có đơn hàng
        </Text>
        <Icon size={40} icon="zi-bookmark-delete"></Icon>
      </Box>
    );
  }


  return (
    <Box className="bg-devider_1 min-h-screen overflow-y-auto mt-[2rem]">
      {orders.map((item) => (
        <ReturnItem key={item.id} item={item} onOpenRating={onOpenRating} />
      ))}

    </Box>
  );
}

export default ReturnHistoryList;
