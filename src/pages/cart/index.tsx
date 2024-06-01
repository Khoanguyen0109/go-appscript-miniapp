import React, { FC } from "react";
import { Divider } from "components/divider";
import { Box, DatePicker, Header, Page, Text } from "zmp-ui";
import { CartItems } from "./cart-items";
import { CartPreview } from "./preview";
import { Delivery } from "./delivery";
import { useVirtualKeyboardVisible } from "hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState } from "state";
import Discount from "./discount";
import PreviewInfo from "./previewInfo";
import { dateSelectedState, timeSelectedState } from "./state";

const CartPage: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const cart = useRecoilValue(cartState);
  const [date, setDate] = useRecoilState(dateSelectedState);
  const [time, setTime] = useRecoilState(timeSelectedState);
  return (
    <Page className="flex flex-col bg-background">
      <Header className="text-center" title="Giỏ hàng" showBackIcon={false} />
      <Text className="px-2 text-md font-bold">Chi tiết đơn hàng</Text>
      <CartItems cart={cart} disableClick={false} />
      {cart.length > 0 && (
        <>
          <Delivery />
          <Box className="mb-3">
            <Text className="text-md font-bold px-2">Thời gian nhận hàng</Text>
            <Box className="flex p-2 justify-between w-screen">
              <Box className="w-2/3">
                <DatePicker
                  value={date}
                  onChange={(value) => {
                    setDate(value);
                  }}
                  dateFormat="dd/mm/yyyy"
                />
              </Box>

              <input
                value={time}
                type="time"
                onChange={(e) => setTime(e.target.value)}
              />
            </Box>
          </Box>
          <Discount />
          <Divider size={14} />
          <PreviewInfo />
        </>
      )}
      <Divider size={12} className="flex-1" />
      {!keyboardVisible && <CartPreview />}
    </Page>
  );
};

export default CartPage;
