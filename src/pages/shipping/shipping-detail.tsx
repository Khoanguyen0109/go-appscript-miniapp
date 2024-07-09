import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, Button, Header, Icon, Page, Text } from "zmp-ui";
import {
  shippingDetailSelected,
  shippingListState,
} from "../../state/shipping-state";
import supabase from "../../client/client";
import {
  getOrderStatusLabel,
  getStatusBGColor,
  getStatusTextColor,
} from "../../utils";
import LoadingScreenOverLay from "../../components/loading-screen";
import { DisplayPrice } from "../../components/display/price";
import { openPhone } from "zmp-sdk";
import { Divider } from "../../components/divider";
import { EOrderStatus } from "../../constantsapp";
import { cloneDeep, isEqual } from "lodash";
import {
  ctvPointOrderSelector,
  ctvPointWhenCustomerOrderSelector,
  globalProductInventoriesSelector,
  shipperPointSelector,
  userPointTodayOrderSettingSelector,
  userPointTomorrowOrderSettingSelector,
  userState,
  userTotalPointState,
  userUncheckedPointState,
} from "../../state";
import { ERoles } from "../../constants";
import { add, startOfDay } from "date-fns";
import { convertToDate } from "../../utils/date";

type Props = {};

function ShippingDetail({}: Props) {
  const user = useRecoilValue(userState);
  const [userTotalPoint, setUserTotalPoint] =
    useRecoilState(userTotalPointState);
  const [userUncheckedPoint, setUserUncheckedPoint] = useRecoilState(
    userUncheckedPointState
  );
  const shipperPoint = useRecoilValue(shipperPointSelector);
  const ctvCommissionPoint = useRecoilValue(ctvPointWhenCustomerOrderSelector);
  const ctvPointOrder = useRecoilValue(ctvPointOrderSelector);
  const userPointInday = useRecoilValue(userPointTodayOrderSettingSelector);
  const userPointTomorrow = useRecoilValue(
    userPointTomorrowOrderSettingSelector
  );

  const globalInventories = useRecoilValue(globalProductInventoriesSelector);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState({});
  const selected = useRecoilValue(shippingDetailSelected);
  const [shippingList, setShippingList] = useRecoilState(shippingListState);
  async function getDetail() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select(
        `*, address: user_addresses(*), orderDetails: order_details(* , product:products(* , inventories:product_inventories(*)))`
      )
      .eq("id", selected.id);
    if (data?.length) {
      setDetail(data[0]);
    }
    setLoading(false);
  }

  useEffect(() => {
    getDetail();
  }, [selected]);

  const openCallScreen = async (phone) => {
    try {
      await openPhone({
        phoneNumber: phone,
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  if (loading) {
    return <LoadingScreenOverLay />;
  }

  const totalQuantity = () => {
    return detail.orderDetails.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };

  const calUserPoint = (user) => {
    const isTodayOrder = isEqual(
      startOfDay(new Date(convertToDate(detail.receiveDate))),
      startOfDay(new Date(detail.createdAt))
    );

    const isTomorrowOrder = isEqual(
      startOfDay(new Date(convertToDate(detail.receiveDate))),
      startOfDay(add(new Date(detail.createdAt), { days: 1 }))
    );
    if (user.role === ERoles.CTV) {
      return ctvPointOrder * totalQuantity();
    } else {
      if (isTodayOrder) {
        return userPointInday * totalQuantity();
      } else if (isTomorrowOrder) {
        return userPointTomorrow * totalQuantity();
      }
    }
    return 0;
  };
  const updateStatusOrder = async (status) => {
    setDetail((pre) => ({ ...pre, status }));
    const index = shippingList.findIndex((item) => item.id === selected.id);
    const cloneShipping = cloneDeep(shippingList);
    cloneShipping[index].status = status;
    setShippingList(cloneShipping);
    const payload = { status };

    if (status === EOrderStatus.DELIVERED) {
      payload.deliverdAt = new Date();

      const shipperPointTotal = userTotalPoint + shipperPoint * totalQuantity();
      const shipperUncheckedPoint =
        userUncheckedPoint + shipperPoint * totalQuantity();
      payload.shipperPoint = shipperPointTotal;
      await supabase
        .from("users")
        .update({
          totalPoint: shipperPointTotal,
          uncheckedPoint: shipperUncheckedPoint,
        })
        .eq("id", user.id);
      setUserTotalPoint(shipperPointTotal);
      setUserUncheckedPoint(shipperUncheckedPoint);
      const { data: orderUserList } = await supabase
        .from("users")
        .select("*")
        .eq("id", detail.userId);
      if (orderUserList?.length > 0) {
        const orderUser = orderUserList[0];
        const userPoint = orderUser.totalPoint + calUserPoint(orderUser);
        payload.userPoint = userPoint;

        await supabase
          .from("users")
          .update({
            totalPoint: userPoint,
            uncheckedPoint: orderUser.uncheckedPoint + calUserPoint(orderUser),
          })
          .eq("id", orderUser.id);
        if (detail.ctvId) {
          const { data: selectedCTV } = await supabase
            .from("users")
            .select()
            .eq("id", orderUser.idCTVShared);
          if (selectedCTV && selectedCTV?.length > 0) {
            const ctvPoint =
              selectedCTV[0].totalPoint + ctvCommissionPoint * totalQuantity();
            payload.ctvPoint = ctvPoint;
            await supabase
              .from("users")
              .update({
                totalPoint: ctvPoint,
                uncheckedPoint:
                  selectedCTV[0].uncheckedPoint +
                  ctvCommissionPoint * totalQuantity(),
              })
              .eq("id", detail.ctvId);
          }
        }
      }
    }
    await supabase
      .from("orders")
      .update({ ...payload })
      .eq("id", selected.id);
  };

  const statusColor = getStatusTextColor(detail.status);
  const bgColor = getStatusBGColor(detail.status);

  const renderButton = (status) => {
    switch (status) {
      case EOrderStatus.WAITING:
        return (
          <Button
            className="w-full rounded-md "
            onClick={() => updateStatusOrder(EOrderStatus.DELIVERING)}
          >
            Nhận đơn hàng
          </Button>
        );
      case EOrderStatus.DELIVERING:
        return (
          <Button
            className="w-full rounded-md"
            onClick={() => updateStatusOrder(EOrderStatus.DELIVERED)}
          >
            Hoàn thành đơn hàng
          </Button>
        );
      default:
        return <></>;
    }
  };
  return (
    <Page className="bg-white">
      <Header title={`Mã đơn ${detail.id}`} showBackIcon={true}></Header>
      <Box className="p-3 m-2 rounded-lg border-[1px] border-solid border-neutral-300">
        <Box className={`rounded-lg ${bgColor} w-fit p-2 mb-3`}>
          <Text className={`${statusColor}`}>
            {getOrderStatusLabel(detail.status)}
          </Text>
        </Box>

        <Box>
          <Text className="mb-1 font-bold">{`Ngày nhận hàng:${
            detail?.receiveDate || ""
          }, ${detail.receiveTime || ""}`}</Text>
        </Box>

        <Box className="bg-neutral-100 rounded-lg p-3">
          <Text className="mb-1">{detail.user?.name}</Text>

          <Text>{`${detail.address.address}, ${detail.address.ward} ${detail.address.district}, ${detail.address.province}`}</Text>
          <Box className="flex items-center justify-between">
            <Box className="flex items-center">
              <Icon icon="zi-call-solid" size={18} />
              <Text className="ml-2">{detail.address.phone}</Text>
            </Box>
            <Button
              size="small"
              className="rounded-md"
              onClick={() => openCallScreen(detail.address.phone)}
            >
              Gọi khách
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="p-3 mt-4 m-2 rounded-lg border-[1px] border-solid border-neutral-300">
        <Box>
          <Box className="flex justify-between mb-3">
            <Text className="font-bold">Chi tiết đơn hàng</Text>
            <Text>{detail.orderDetails.length} món</Text>
          </Box>

          {detail.orderDetails.map((item) => {
            const selectedInventories = item.inventoryIds.split(",");

            const options = [
              ...item.product.inventories,
              ...globalInventories,
            ].reduce((acc, value) => {
              if (selectedInventories.includes(value.id.toString())) {
                acc.push(value);
              }
              return acc;
            }, []);
            return (
              <Box key={item.id} className="flex items-center mb-2">
                <Text>{item.quantity}x</Text>
                <Text className=" ml-2">{item.product.name}</Text>
                <Text>{options.map((item) => item.name).join(",")}</Text>
              </Box>
            );
          })}
        </Box>
        <Box className="border-t-[1px] mt-3 pt-3 flex border-dashed border-neutral-300 justify-between items-center">
          <Text>Tổng cộng</Text>
          <Text className="text-lg font-bold text-blue-500">
            <DisplayPrice>{detail.total}</DisplayPrice>{" "}
          </Text>
        </Box>
      </Box>
      <Divider size={32} className="flex-1" />
      <Box className="m-2">{renderButton(detail.status)}</Box>
    </Page>
  );
}

export default ShippingDetail;
