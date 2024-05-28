import { DisplayPrice } from "components/display/price";
import { ROUTES } from "pages/route";
import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  calDiscount,
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
import { addressSelectedState, noteState } from "./state";
import supabase from "../../client/client";
import { EOrderStatus } from "../../constantsapp";

export const CartPreview: FC = () => {
  const cart = useRecoilValue(cartState);
  console.log("cart", cart);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const user = useRecoilValue(userState);
  const preTotal = useRecoilValue(preTotalPriceState);
  const [note, setNote] = useRecoilState(noteState);
  const resetCart = useResetRecoilState(cartState);
  const [discount, setDiscount] = useRecoilState(discountState);
  const phone = useRecoilValue(phoneState);
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

  const callBackPayment = async (data) => {
    try {
      const orderCreated = await supabase
        .from("orders")
        .insert({
          userId: user.id,
          // paymentMethod: paymentMethod.label,
          addressId: address?.id,
          total: totalPrice,
          discount: discount ? calDiscount(discount, totalPrice) : 0,
          voucher: discount?.voucher || "",
          preTotal,
          quantity,
          note,
          status: EOrderStatus.WAITING,
          zaloOrderId: data?.orderId,
        })
        .select();
      const details = cart.reduce((acc, value) => {
        acc.push({
          orderId: orderCreated.data[0].id,
          productId: value.product.id,
          total: parseFloat(value.price) * parseInt(value.quantity),
          quantity: value.quantity,
          inventoryIds: Object.keys(value.options)
            .map((key) => value.options[key].id)
            .join(","),
        });
        return acc;
      }, []);
      console.log("details", details);
      await supabase.from("order_details").insert(details);
      setAddressSelected(null);
      // setPaymentMethod(null);
      setNote("");
      resetCart();
      navigate(ROUTES.PAYMENT_SUCCESS);
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const makePayment = async () => {
    try {
      if (!address?.id) {
        return openSnackbar({
          text: "Vui lòng chọn địa chỉ giao hàng",
          type: "error",
          icon: true,
          duration: 1000,
        });
      }
      setLoading(true);
      const data = await pay(totalPrice, callBackPayment);
      // callBackPayment(null);
    } catch (error) {
    } finally {
      setLoading(false);
    }

    // console.log("data", data);
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
        disabled={!quantity || loading || !address}
        fullWidth
        onClick={() => makePayment()}
      >
        {loading ? <Loading /> : "Đặt hàng"}
      </Button>
    </Box>
  );
};
