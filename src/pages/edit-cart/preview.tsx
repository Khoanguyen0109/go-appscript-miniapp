import { DisplayPrice } from "components/display/price";
import Loading from "components/loading";
import { ROUTES } from "pages/route";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import {
  editCartState,
  orderDetailState,
  orderState,
  totalPriceEditCartState,
  totalQuantityEditCartState,
} from "state";
import { Box, Button, Text } from "zmp-ui";
import supabase from "../../client/client";
import useCustomSnackbar from "../../hooks/useCustomSnackbar";

export const EditCartPreview: FC = () => {
  const cart = useRecoilValue(editCartState);
  const navigate = useNavigate();
  const [detail, setDetail] = useRecoilState(orderDetailState);
  console.log("detail", detail);
  const refresh = useRecoilRefresher_UNSTABLE(orderState);

  const [loading, setLoading] = useState(false);
  const quantity = useRecoilValue(totalQuantityEditCartState);
  const totalPrice = useRecoilValue(totalPriceEditCartState);

  const resetCart = useResetRecoilState(editCartState);

  const { openSnackbar } = useCustomSnackbar();

  const updateDetail = async (item) => {
    await supabase
      .from("order_details")
      .update({
        quantity: item.quantity,
      })
      .eq("id", item.id);
  };

  const removeDetail = async (item) => {
    await supabase.from("order_details").delete().eq("id", item.id);
  };

  const removeList = detail.orderDetails.filter(
    (item) => !cart.find((cartItem) => cartItem !== item.id)
  );
  const makePayment = async () => {
    try {
      const removeList = detail?.orderDetails.filter(
        (item) => !cart.find((cartItem) => cartItem !== item.id)
      );
      setLoading(true);
      const arrPromise: Promise<void>[] = [];
      cart.forEach((item) => {
        arrPromise.push(updateDetail(item));
      });
      removeList.forEach((item) => {
        arrPromise.push(removeDetail(item));
      });
      await Promise.all(arrPromise);
      await supabase
        .from("orders")
        .update({
          preTotal: totalPrice,
          quantity: quantity,
          total: detail.total - detail.preTotal + totalPrice,
        })
        .eq("id", detail.id);
      resetCart();
      refresh();
      openSnackbar({
        text: "Cập nhật thành công",
        type: "success",
        icon: true,
        duration: 1000,
      });
      navigate(ROUTES.ORDER);
    } catch (error) {
      openSnackbar({
        text: "Cập nhật thất bại",
        type: "success",
        icon: true,
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box flex className="sticky bottom-0 bg-background p-2">
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
        onClick={() => makePayment()}
      >
        {loading ? <Loading /> : "Xác nhận đơn hàng"}
      </Button>
    </Box>
  );
};
