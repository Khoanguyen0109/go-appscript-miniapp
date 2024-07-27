import { EOrderReturnStatus, getOrderReturnStatusLabel } from "constantsapp";
import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { forceOrderUpdate, returnHistoryState } from "state";
import { Header, Page, Tabs } from "zmp-ui";
import ReturnHistoryList from "./list";

// import OrderList from "./order-list";

type Props = {};

function ReturnHistory({}: Props) {
  const orderUpdate = useSetRecoilState(forceOrderUpdate);

  const orders = useRecoilValue(returnHistoryState);
  console.log("orders", orders);
  const orderWaitingConfirm = orders.filter(
    (item) => item.status === EOrderReturnStatus.WAITING_CONFIRMATION
  );
  console.log("orderWaitingConfirm", orderWaitingConfirm);
  const orderAcceptAccept = orders.filter(
    (item) => item.status === EOrderReturnStatus.ACCEPT_RETURN
  );
  const orderRejectReturn = orders.filter(
    (item) => item.status === EOrderReturnStatus.REJECT_RETURN
  );
  const orderComplete = orders.filter(
    (item) => item.status === EOrderReturnStatus.COMPLETED
  );

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
        <Tabs.Tab
          key={EOrderReturnStatus.WAITING_CONFIRMATION}
          label={getOrderReturnStatusLabel(
            EOrderReturnStatus.WAITING_CONFIRMATION
          )}
        >
          <ReturnHistoryList orders={orderWaitingConfirm} />
        </Tabs.Tab>
        <Tabs.Tab
          key={EOrderReturnStatus.ACCEPT_RETURN}
          label={getOrderReturnStatusLabel(EOrderReturnStatus.ACCEPT_RETURN)}
        >
          <ReturnHistoryList orders={orderAcceptAccept} />
        </Tabs.Tab>
        <Tabs.Tab
          key={EOrderReturnStatus.REJECT_RETURN}
          label={getOrderReturnStatusLabel(EOrderReturnStatus.REJECT_RETURN)}
        >
          <ReturnHistoryList orders={orderRejectReturn} />
        </Tabs.Tab>
        <Tabs.Tab
          key={EOrderReturnStatus.COMPLETED}
          label={getOrderReturnStatusLabel(EOrderReturnStatus.COMPLETED)}
        >
          <ReturnHistoryList orders={orderComplete} />
        </Tabs.Tab>
      </Tabs>
    </Page>
  );
}

export default ReturnHistory;
