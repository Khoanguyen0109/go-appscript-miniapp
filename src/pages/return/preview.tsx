import { DisplayPrice } from "components/display/price";
import Loading from "components/loading";
import { differenceInMinutes } from "date-fns";
import { ROUTES } from "pages/route";
import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  minOrderDeliveryTimeSelector,
  returnState,
  selectedDeliveryTimeState,
  totalPriceReturnState,
  totalQuantityReturnState,
  userState,
} from "state";
import { calcFinalPrice } from "utils/product";
import { Box, Button, Text, useSnackbar } from "zmp-ui";
import supabase from "../../client/client";
import { EOrderReturnStatus } from "../../constantsapp";

export const ReturnReview: FC = () => {
  const cart = useRecoilValue(returnState);
  const navigate = useNavigate();
  const minOrderDeliveryTime = useRecoilValue(minOrderDeliveryTimeSelector);

  const [loading, setLoading] = useState(false);
  const quantity = useRecoilValue(totalQuantityReturnState);
  const totalPrice = useRecoilValue(totalPriceReturnState);
  const resetCart = useResetRecoilState(returnState);
  const [deliveryTime, setDeliveryTime] = useRecoilState(
    selectedDeliveryTimeState
  );
  const user = useRecoilValue(userState);
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();

  const timmerId = useRef();

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );

  // const calPointUser = useRecoilValue(calPointUserSelector)

  const makeReturn = async () => {
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
      setLoading(true);

      // Insert into returns table
      const { data: returnData, error: returnError } = await supabase
        .from("returns")
        .insert({
          quantity: quantity,
          total: totalPrice,
          userId: user.id,
          status: EOrderReturnStatus.WAITING_CONFIRMATION,
        })
        .select()
        .single();

      if (returnError) throw returnError;

      // Insert into return_details table
      const returnDetails = cart
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          total: calcFinalPrice(item.product, item.options),
          returnId: returnData.id,
          quantity: item.quantity,
          productId: item.product.id,
          inventoryIds: Object.keys(item.options)
            .reduce((acc, key) => {
              item.options[key].forEach((option) => acc.push(option.id));
              return acc;
            }, [])
            .join(","),
        }));

      const { error: detailsError } = await supabase
        .from("return_details")
        .insert(returnDetails);

      if (detailsError) throw detailsError;

      // Reset states and navigate
      resetCart();
      navigate(ROUTES.RETURN_SUCCESS);
    } catch (error) {
      console.error("Error creating return:", error);
      openSnackbar({
        text: "Có lỗi xảy ra khi tạo đơn hoàn",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box flex className="sticky bottom-0 bg-[#f4f5f7] p-2 justify-between flex">
      <Box
        flex
        flexDirection="column"
        justifyContent="space-between"
        className="min-w-[120px] flex-none"
      >
        <Text className="text-black" size="xSmall">
          {quantity} sản phẩm
        </Text>
        <Text.Title size="large" className={"text-nature-500 font-semibold"}>
          <DisplayPrice>{totalPrice}</DisplayPrice>
        </Text.Title>
      </Box>
      <Button
        type="highlight"
        disabled={!quantity || loading}
        fullWidth
        className={"rounded-xl w-1/2"}
        onClick={() => makeReturn()}
      >
        {loading ? <Loading /> : "Đặt đơn hoàn"}
      </Button>
    </Box>
  );
};
