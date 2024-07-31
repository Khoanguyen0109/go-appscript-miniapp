import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { forceOrderUpdate, orderState } from "state";
import { Header, Page, Tabs } from "zmp-ui";
import "./index.css";
import { EOrderStatus } from "constantsapp";
import styled from "styled-components";
import OrderList from "./order-list";

type Props = {};

function Order({}: Props) {
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

  useEffect(() => {
    return () => {
      forceUpdate();
    };
  }, []);
  const StyledTabs = styled(Tabs)`
      .zaui-tabs-tabbar{
          position: fixed;
          top: 3rem;
      }
  `;
  return (
    <Page className="bg-background">
      <Header title="Lịch sử đặt hàng" showBackIcon={true} />
      <StyledTabs className="" id="contact-list">
        <StyledTabs.Tab key="waiting" label="Chờ xác nhận">
          <OrderList orders={orderWaiting} />
        </StyledTabs.Tab>
        <StyledTabs.Tab key="delivering" label="Đang vận chuyển">
          <OrderList orders={orderDelivering} />
        </StyledTabs.Tab>
        <StyledTabs.Tab key="delivered" label="Đã giao hàng">
          <OrderList orders={orderDelivered} />
        </StyledTabs.Tab>
        <StyledTabs.Tab key="cancel" label="Đã huỷ">
          <OrderList orders={orderCancel} />
        </StyledTabs.Tab>
      </StyledTabs>
    </Page>
  );
}

export default Order;
