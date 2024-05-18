import { DisplayPrice } from "components/display/price";
import { ROUTES } from "pages/route";
import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  cartState,
  discountState,
  phoneState,
  preTotalPriceState,
  shippingFeeState,
  totalPriceState,
  totalQuantityState,
  userState,
} from "state";
import pay, { getOptionString } from "utils/product";
import { Box, Button, Text, useSnackbar } from "zmp-ui";
import Loading from "components/loading";
import { Payment } from "zmp-sdk";
import { addressSelectedState } from "./state";

export const CartPreview: FC = () => {
  const cart = useRecoilValue(cartState);
  console.log("cart", cart);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);

  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();

  const [address, setAddressSelected] = useRecoilState(addressSelectedState);
  const timmerId = useRef();

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );

  const makePayment = async () => {
    setLoading(true);
    if (!address?.id) {
      return openSnackbar({
        text: "Vui lòng chọn địa chỉ giao hàng",
        type: "error",
        icon: true,
        duration: 1000,
      });
    }
    const data = await pay(totalPrice);
    setLoading(false);
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
