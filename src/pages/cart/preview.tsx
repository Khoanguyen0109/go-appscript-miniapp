import { axiosInstance } from "api/instance";
import { DisplayPrice } from "components/display/price";
import { ROUTES } from "pages/route";
import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import Loading from "components/loading";
import { Payment } from "zmp-sdk";

export const CartPreview: FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const cart = useRecoilValue(cartState);
  const resetCart = useResetRecoilState(cartState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  console.log('totalPrice', totalPrice)
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // gọi api checkTransaction để lấy thông tin giao dịch
    Payment.checkTransaction({
      data: Object.fromEntries([...searchParams]),
      success: (rs) => {
        // Kết quả giao dịch khi gọi api thành công
        const { id, resultCode, msg, transTime, createdAt } = rs;
      },
      fail: (err) => {
        // Kết quả giao dịch khi gọi api thất bại
        console.log(err);
      },
    });
  }, []);

  const makePayment = async () => {
    setLoading(true);
    const data = await pay(totalPrice, callBackPayment);
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
