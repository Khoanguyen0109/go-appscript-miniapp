import { ROUTES } from "pages/route";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { forceOrderUpdate, orderState } from "state";
import { Header, Page, Tabs } from "zmp-ui";
import "./index.css";
import OrderList from "./order-list";
import { EOrderStatus } from "constantsapp";
type Props = {};

function Order({}: Props) {
  const navigate = useNavigate();
  const orderUpdate = useSetRecoilState(forceOrderUpdate);

  const orders = useRecoilValue(orderState);
  const orderWaiting = orders.filter(
    (item) => item.status === EOrderStatus.WAITING
  );
  const orderDelivering = orders.filter(
    (item) => item.status === EOrderStatus.DELIVERING
  );
  const orderDelivered = orders.filter(
    (item) => item.status === EOrderStatus.DELIVERED
  );
  const orderCancel = orders.filter(
    (item) => item.status === EOrderStatus.CANCEL
  );

  const forceUpdate = () => orderUpdate((n) => n + 1);

  const navigateToDetail = (id) => {
    navigate(ROUTES.ORDER_DETAIL(id));
  };
  useEffect(() => {
    return () => {
      forceUpdate();
    };
  }, []);
  // const iconStatus = (status) => {
  //   switch (status) {
  //     case EOrderStatus.WAITING:
  //       return {
  //         icon: "zi-clock-1",
  //         color: "text-grey",
  //       };
  //     case EOrderStatus.DELIVERING:
  //       return { icon: "zi-leave", color: "text-yellow" };
  //     case EOrderStatus.DELIVERED:
  //       return {
  //         icon: "zi-check-circle",
  //         color: " text-green",
  //       };

  //     case EOrderStatus.CANCEL:
  //       return {
  //         icon: "zi-close",
  //         color: "text-red",
  //       };
  //     default:
  //       break;
  //   }
  // };
  return (
    <Page className="bg-background">
      <Header title="Lịch sử đặt hàng" showBackIcon={true} />
      <Tabs className="w-full" id="contact-list">
        <Tabs.Tab key="waiting" label="Chờ xác nhận">
          <OrderList orders={orderWaiting} />
        </Tabs.Tab>
        <Tabs.Tab key="delivering" label="Đang vận chuyển">
          <OrderList orders={orderDelivering} />
        </Tabs.Tab>
        <Tabs.Tab key="delivered" label="Đã vận chuyển">
          <OrderList orders={orderDelivered} />
        </Tabs.Tab>
        <Tabs.Tab key="cancel" label="Đã huỷ">
          <OrderList orders={orderCancel} />
        </Tabs.Tab>
      </Tabs>
    </Page>
  );
}

export default Order;
