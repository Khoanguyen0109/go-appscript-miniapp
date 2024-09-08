import { DisplayPrice } from "components/display/price";
import { ROUTES } from "pages/route";
import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  calDiscount,
  cartState,
  discountState,
  minOrderDeliveryTimeSelector,
  minOrderItemSelector,
  preTotalPriceState,
  selectedDeliveryTimeState,
  totalPriceState,
  totalQuantityState,
  userState,
} from "state";
import pay, { calcFinalPrice } from "utils/product";
import { Box, Button, Text, useSnackbar } from "zmp-ui";
import Loading from "components/loading";
import {
  addressSelectedState,
  dateSelectedState,
  noteState,
  timeSelectedState,
  voucherSelectedState,
} from "./state";
import supabase from "../../client/client";
import { EOrderStatus, EUserVoucherStatus } from "../../constantsapp";
import { userVouchersState } from "../../state/discount-state";
import { differenceInMinutes } from "date-fns";

export const CartPreview: FC = () => {
  const cart = useRecoilValue(cartState);
  const navigate = useNavigate();
  const [userVoucher, setUserVoucher] = useRecoilState(userVouchersState);

  const minOrderItems = useRecoilValue(minOrderItemSelector);
  const minOrderDeliveryTime = useRecoilValue(minOrderDeliveryTimeSelector);

  const [loading, setLoading] = useState(false);
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const user = useRecoilValue(userState);
  const preTotal = useRecoilValue(preTotalPriceState);
  const [note, setNote] = useRecoilState(noteState);
  const resetCart = useResetRecoilState(cartState);
  const date = useRecoilValue(dateSelectedState);
  const time = useRecoilValue(timeSelectedState);
  const [deliveryTime, setDeliveryTime] = useRecoilState(
    selectedDeliveryTimeState
  );
  const [discount, setDiscount] = useRecoilState(discountState);
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
          discount: discount ? calDiscount(discount, preTotal) : 0,
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
      if (voucherSelected && discount && discount?.public) {
        const newUserVoucher = userVoucher.filter(
          (item) => item.id!== voucherSelected?.id
        );
        setUserVoucher(newUserVoucher);
        await supabase
          .from("user_vouchers")
          .update({
            status: EUserVoucherStatus.USED,
            userId: user.id
          })
          .eq("discountId", discount?.id);
      } else if (voucherSelected && discount && discount?.memberClass) {
        // const newUserVoucher = userVoucher.filter(
        //   (item) => item.id!== voucherSelected?.id
        // );
        // debugger
        // setUserVoucher(newUserVoucher);
        // Dùng mãi mãi đối với voucher theo hạng. các loại khác dùng 1 lần
      } else if (discount && !discount?.public && voucherSelected) {
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
      // setAddressSelected(null);
      // setDeliveryTime(+new Date());
      // setVoucherSelected(null);
      // setDiscount(null);
      // setNote("");
      // resetCart();
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
        {loading ? <Loading /> : "Đặt hàng"}
      </Button>
    </Box>
  );
};
