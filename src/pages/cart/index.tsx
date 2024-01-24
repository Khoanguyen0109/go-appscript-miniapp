import React, { FC, useEffect } from "react";
import { Divider } from "components/divider";
import { Header, Page, Text } from "zmp-ui";
import { CartItems } from "./cart-items";
import { CartPreview } from "./preview";
import { Delivery } from "./delivery";
import { useVirtualKeyboardVisible } from "hooks";
import { useRecoilValue } from "recoil";
import { cartState } from "state";
import Discount from "./discount";
import PreviewInfo from "./previewInfo";

const CartPage: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const cart = useRecoilValue(cartState);

  return (
    <Page className="flex flex-col bg-background">
      <Header className="text-center" title="Giỏ hàng" showBackIcon={false} />
      <Text className="px-2 text-md font-bold">Chi tiết đơn hàng</Text>
      <CartItems cart={cart} disableClick={false} />
      {cart.length > 0 && (
        <>
          <Delivery />
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
