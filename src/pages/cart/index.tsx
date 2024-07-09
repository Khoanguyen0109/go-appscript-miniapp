import React, { FC } from "react";
import { Divider } from "components/divider";
import { Box, Header, Page, Text } from "zmp-ui";
import { CartItems } from "./cart-items";
import { CartPreview } from "./preview";
import { Delivery } from "./delivery";
import { useVirtualKeyboardVisible } from "hooks";
import { useRecoilValue } from "recoil";
import { calPointUserSelector, cartState, totalQuantityState } from "state";
import PreviewInfo from "./previewInfo";
import { TimePicker } from "./time-picker";

const CartPage: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const cart = useRecoilValue(cartState);

  const quantity = useRecoilValue(totalQuantityState);

  const calPointUser = useRecoilValue(calPointUserSelector);
  return (
    <Page className="flex flex-col bg-background">
      <Header className="text-center" title="Giỏ hàng" showBackIcon={false} />
      <Text className="px-2 text-md font-bold">Chi tiết đơn hàng</Text>
      <CartItems disableClick={false} />
      {cart.length > 0 && (
        <>
          <Delivery />
          <Box className="mb-3">
            <Text className="text-md font-bold px-2">Thời gian nhận hàng</Text>
            <Box className="flex p-2 justify-between w-screen">
              <TimePicker />
            </Box>
          </Box>
          {calPointUser && (
            <Box>
              <Text className="m-2 text-sm font-bold text-green">
                {`Bạn  nhận dc ${
                  calPointUser * quantity
                } xu tích lũy cho đơn hàng này`}
              </Text>
            </Box>
          )}
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
