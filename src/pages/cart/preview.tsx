import { axiosInstance } from "api/instance";
import { DisplayPrice } from "components/display/price";
import { ROUTES } from "pages/route";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import {
  cartState,
  phoneState,
  totalPriceState,
  totalQuantityState,
  userState,
} from "state";
import pay from "utils/product";
import { Box, Button, Text } from "zmp-ui";
import ReactLoading from "react-loading";
import Loading from "components/loading";

export const CartPreview: FC = () => {
  const cart = useRecoilValue(cartState);
  const resetCart = useResetRecoilState(cartState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const user = useRecoilValue(userState);
  const phone = useRecoilValue(phoneState);
  const callBackPayment = async (data) => {
    try {
      const res = await axiosInstance.post("/orders", {
        userId: user.id,
        user: { ...user, phone },
        items: cart.reduce((acc, value) => {
          acc.push({ product_id: value.product.id, quantity: value.quantity });
          return acc;
        }, []),
        orderId: data.orderId,
        total: totalPrice,
      });
      resetCart();
      navigate(ROUTES.PAYMENT_SUCCESS);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  const makePayment = async () => {
    setLoading(true);
    const data = await pay(totalPrice, callBackPayment);
    console.log("data", data);
  };
  return (
    <Box flex className="sticky bottom-0 bg-background p-4 space-x-4">
      <Box
        flex
        flexDirection="column"
        justifyContent="space-between"
        className="min-w-[120px] flex-none"
      >
        <Text className="text-gray" size="xSmall">
          {quantity} sản phẩm
        </Text>
        <Text.Title size="large">
          <DisplayPrice>{totalPrice}</DisplayPrice>
        </Text.Title>
      </Box>
      <Button
        type="highlight"
        disabled={!quantity || loading}
        fullWidth
        // onClick={() => callBackPayment({data: 1})}
        onClick={() => makePayment()}
      >
        {loading ? <Loading /> : "Đặt hàng"}
      </Button>
    </Box>
  );
};
