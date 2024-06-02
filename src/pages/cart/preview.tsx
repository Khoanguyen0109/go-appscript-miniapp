import { DisplayPrice } from "components/display/price";
import { ROUTES } from "pages/route";
import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  calDiscount,
  calPointUserSelector,
  cartState,
  ctvPointOrderSelector,
  ctvPointWhenCustomerOrderSelector,
  discountState,
  minOrderItemSelector,
  phoneState,
  preTotalPriceState,
  totalPriceState,
  totalQuantityState,
  userPointTodayOrderSettingSelector,
  userPointTomorrowOrderSettingSelector,
  userState,
  userTotalPointState,
  userUncheckedPointState,
} from "state";
import pay from "utils/product";
import { Box, Button, Text, useSnackbar } from "zmp-ui";
import Loading from "components/loading";
import {
  addressSelectedState,
  dateSelectedState,
  noteState,
  timeSelectedState,
} from "./state";
import supabase from "../../client/client";
import { EOrderStatus } from "../../constantsapp";
import { formatDate } from "../../utils/date";
import { isToday, isTomorrow } from "date-fns";
import { ERoles } from "../../constants";

export const CartPreview: FC = () => {
  const cart = useRecoilValue(cartState);
  const navigate = useNavigate();
  const minOrderItems = useRecoilValue(minOrderItemSelector);
  const [loading, setLoading] = useState(false);
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const user = useRecoilValue(userState);
  const preTotal = useRecoilValue(preTotalPriceState);
  const [note, setNote] = useRecoilState(noteState);
  const resetCart = useResetRecoilState(cartState);
  const [date, setDate] = useRecoilState(dateSelectedState);
  const [userTotalPoint, setUserTotalPoint] =
    useRecoilState(userTotalPointState);
  const [userUncheckedPoint, setUserUncheckedPoint] = useRecoilState(
    userUncheckedPointState
  );

  const ctvPointOrder = useRecoilValue(ctvPointOrderSelector);
  const ctvCommissionPoint = useRecoilValue(ctvPointWhenCustomerOrderSelector);
  const userPointInday = useRecoilValue(userPointTodayOrderSettingSelector);
  const userPointTomorrow = useRecoilValue(
    userPointTomorrowOrderSettingSelector
  );
  const [time, setTime] = useRecoilState(timeSelectedState);
  const [discount, setDiscount] = useRecoilState(discountState);
  const phone = useRecoilValue(phoneState);
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
  const [hours, minutes] = time ? time?.split(":").map(Number) : [0, 0];

  const convertDate: Date = new Date(`${date}`);
  convertDate.setHours(hours, minutes, 0, 0);
  console.log("convertDate", convertDate);
  const today: Date = new Date();
  const diffInMilliseconds = convertDate - today;
  const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
  const isMoreThanTwoHoursAhead = diffInMilliseconds > twoHoursInMilliseconds;
  const isTodayOrder = isToday(convertDate);
  const isTomorrowOrder = isTomorrow(convertDate);
  const [address, setAddressSelected] = useRecoilState(addressSelectedState);
  const timmerId = useRef();

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );

  const calPointUser = useRecoilValue(calPointUserSelector)

  const callBackPayment = async (data) => {
    try {
      const orderCreated = await supabase
        .from("orders")
        .insert({
          // userId: user.role == ERoles.CTV ? address.userId : user.id,
          // ctvId: user.role == ERoles.CTV ? user.id : null,
          userId: user.id,
          addressId: address?.id,
          total: totalPrice,
          discount: discount ? calDiscount(discount, totalPrice) : 0,
          voucher: discount?.voucher || "",
          preTotal,
          quantity,
          note,
          status: EOrderStatus.WAITING,
          zaloOrderId: data?.orderId,
          receiveDate: formatDate(new Date(date).toISOString()),
          receiveTime: time,
          userPoint: calPointUser,
          ctvPoint: user.idCTVShared ? ctvCommissionPoint : 0,
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

      await Promise.all([
        supabase.from("order_details").insert(details),
        updateUserPoint(),
      ]);
      setAddressSelected(null);
      setDate(new Date());
      setTime("");
      setNote("");
      resetCart();
      navigate(ROUTES.PAYMENT_SUCCESS);
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const updateUserPoint = async () => {
    if (user.idCTVShared) {
      const { data: selectedCTV } = await supabase
        .from("users")
        .select()
        .eq("id", user.idCTVShared);
      console.log("selectedCTV", selectedCTV);
      if (selectedCTV?.length > 0) {
        await supabase
          .from("users")
          .update({
            totalPoint: selectedCTV[0].totalPoint + ctvCommissionPoint,
            uncheckedPoint: selectedCTV[0].uncheckedPoint + ctvCommissionPoint,
          })
          .eq("id", user.idCTVShared);
      }
    }
    if (calPointUser) {
      const payload = {
        totalPoint: userTotalPoint + calPointUser,
        uncheckedPoint: userUncheckedPoint + calPointUser,
      };
      await supabase.from("users").update(payload).eq("id", user.id);
      setUserTotalPoint(userTotalPoint + calPointUser);
      setUserUncheckedPoint(userUncheckedPoint + calPointUser);
    }
  };

  const makePayment = async () => {
    if (!isMoreThanTwoHoursAhead) {
      return openSnackbar({
        text: `Thời gian giao hàng cách tối thiểu 2 giờ`,
        type: "error",
        icon: true,
        duration: 1000,
      });
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
