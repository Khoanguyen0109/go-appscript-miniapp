import React, { FC, useEffect } from "react";
import { Divider } from "components/divider";
import { Header, Page } from "zmp-ui";
import { CartItems } from "./cart-items";
import { CartPreview } from "./preview";
import { TermsAndPolicies } from "./term-and-policies";
import { Delivery } from "./delivery";
import { useVirtualKeyboardVisible } from "hooks";
import { useRecoilValue } from "recoil";
import { cartState } from "state";

const CartPage: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const cart = useRecoilValue(cartState);

  return (
    <Page className="flex flex-col">
      <Header title="Giỏ hàng" showBackIcon={false} />
      <CartItems cart={cart} disableClick={false} />
      <Delivery />
      <Divider size={12} />
      <TermsAndPolicies />
      <Divider size={32} className="flex-1" />
      {!keyboardVisible && <CartPreview />}
    </Page>
  );
};

export default CartPage;
