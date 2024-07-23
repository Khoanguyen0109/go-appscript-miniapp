import { DisplayPrice } from "components/display/price";
import Loading from "components/loading";
import { differenceInMinutes } from "date-fns";
import { ROUTES } from "pages/route";
import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  calDiscount, discountEditCartState,
  discountState,
  editCartState,
  minOrderDeliveryTimeSelector,
  minOrderItemSelector,
  preTotalPriceEditCartState,
  selectedDeliveryTimeState,
  totalPriceEditCartState,
  totalQuantityEditCartState,
  userState,
} from "state";
import pay, { calcFinalPrice } from "utils/product";
import { Box, Button, Text, useSnackbar } from "zmp-ui";
import supabase from "../../client/client";
import { EOrderStatus, EUserVoucherStatus } from "../../constantsapp";
import { userVouchersState } from "../../state/discount-state";
import {
  addressSelectedState,
  dateSelectedState,
  noteState,
  timeSelectedState,
  voucherSelectedState,
} from "../cart/state";

export const EditCartPreview: FC = () => {
  const cart = useRecoilValue(editCartState);
  const navigate = useNavigate();
  const [userVoucher, setUserVoucher] = useRecoilState(userVouchersState);

  const minOrderItems = useRecoilValue(minOrderItemSelector);
  const minOrderDeliveryTime = useRecoilValue(minOrderDeliveryTimeSelector);

  const [loading, setLoading] = useState(false);
  const quantity = useRecoilValue(totalQuantityEditCartState);
  const totalPrice = useRecoilValue(totalPriceEditCartState);
  const user = useRecoilValue(userState);
  const preTotal = useRecoilValue(preTotalPriceEditCartState);
  const [note, setNote] = useRecoilState(noteState);
  const resetCart = useResetRecoilState(editCartState);
  const date = useRecoilValue(dateSelectedState);
  const time = useRecoilValue(timeSelectedState);
  const [deliveryTime, setDeliveryTime] = useRecoilState(
    selectedDeliveryTimeState
  );
  const [discount, setDiscount] = useRecoilState(discountEditCartState);
  const [voucherSelected, setVoucherSelected] =
    useRecoilState(voucherSelectedState);
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

  // const calPointUser = useRecoilValue(calPointUserSelector)

  const callBackPayment = async (data) => {
    try {
      const orderCreated = await supabase
        .from("orders")
        .insert({
          // userId: user.role == ERoles.CTV ? address.userId : user.id,
          // ctvId: user.role == ERoles.CTV ? user.id : null,
          userId: user.id,
          ctvId: user.idCTVShared,
          addressId: address?.id,
          total: totalPrice,
          discount: discount ? calDiscount(discount, totalPrice) : 0,
          voucher: discount?.voucher || "",
          preTotal,
          quantity,
          note,
          status: EOrderStatus.WAITING,
          zaloOrderId: data?.orderId,
          receiveDate: date,
          receiveTime: time,
          // userPoint: calPointUser,
          // ctvPoint: user.idCTVShared ? ctvCommissionPoint : 0,
        })
        .select();
      if (discount && !discount?.public && voucherSelected) {
        const newUserVoucher = userVoucher.filter(
          (item) => item.id !== voucherSelected?.id
        );
        setUserVoucher(newUserVoucher);
        await supabase
          .from("user_vouchers")
          .update({
            status: EUserVoucherStatus.USED,
          })
          .eq("id", voucherSelected?.id);
      }
      const details = cart.reduce((acc, value) => {
        acc.push({
          orderId: orderCreated.data[0].id,
          productId: value.product.id,
          total: calcFinalPrice(value.product, value.options),
          quantity: value.quantity,
          inventoryIds: Object.keys(value.options)
            .reduce((acc, key) => {
              value.options[key].forEach((item) => acc.push(item.id));
              return acc;
            }, [])
            .join(","),
        });
        return acc;
      }, []);
      await Promise.all([supabase.from("order_details").insert(details)]);
      setAddressSelected(null);
      setDeliveryTime(+new Date());
      setVoucherSelected(null);
      setDiscount(null);
      setNote("");
      resetCart();
      navigate(ROUTES.PAYMENT_SUCCESS);
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const makePayment = async () => {
    if (minOrderDeliveryTime) {
      const today = new Date();
      const deliveryDate = new Date(deliveryTime);
      // Calculate the difference in hours
      const hoursDifference = differenceInMinutes(deliveryDate, today);

      const isMoreThan2Hours = hoursDifference >= minOrderDeliveryTime;

      if (!isMoreThan2Hours) {
        return openSnackbar({
          text: `Thời gian giao hàng cách tối thiểu ${minOrderDeliveryTime} phút`,
          type: "error",
          icon: true,
          duration: 1000,
        });
      }
    }

    try {
      if (quantity < minOrderItems) {
        return openSnackbar({
          text: `Vui lòng chọn tối thiểu ${minOrderItems} phần`,
          type: "error",
          icon: true,
          duration: 1000,
        });
      }
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
      console.log("error", error);
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
        disabled={!quantity || loading || !address || !date || !time}
        fullWidth
        onClick={() => makePayment()}
      >
        {loading ? <Loading /> : "Xác nhận đơn hàng"}
      </Button>
    </Box>
  );
};
