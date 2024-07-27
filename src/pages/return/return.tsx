import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { forceOrderUpdate, orderState, returnState } from "state";
import { Header, Page, Tabs } from "zmp-ui";
import "../order/index.css";
import { EOrderReturnStatus } from "constantsapp";
import OrderList from "../order/order-list";

type Props = {};

function Order({}: Props) {
  const orderUpdate = useSetRecoilState(forceOrderUpdate);

  // const returns = useRecoilValue(returnState);
  // const orderWaitingConfirmation = returns.filter(
  //   (item) => item.status === EOrderReturnStatus.WAITING_CONFIRMATION
  // );
  // const orderAcceptReturn = returns.filter(
  //   (item) => item.status === EOrderReturnStatus.ACCEPT_RETURN
  // );
  // const orderRejectReturn = returns.filter(
  //   (item) => item.status === EOrderReturnStatus.REJECT_RETURN
  // );
  // const orderCompleted = returns.filter(
  //   (item) => item.status === EOrderReturnStatus.COMPLETED
  // );

  const forceUpdate = () => orderUpdate((n) => n + 1);

  useEffect(() => {
    return () => {
      forceUpdate();
    };
  }, []);

  return (
    <Page className="bg-background">
      <Header title="Lịch sử hoàn đơn" showBackIcon={true} />
      <Tabs className="w-full" id="contact-list">
        <Tabs.Tab key="waiting" label="Chờ xác nhận">
          {/*<OrderList orders={orderWaitingConfirmation} />*/}
        </Tabs.Tab>
        <Tabs.Tab key="delivered" label="Thành công">
          {/*<OrderList orders={orderCompleted} />*/}
        </Tabs.Tab>
      </Tabs>
    </Page>
  );
}

export default Order;
