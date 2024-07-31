import { EOrderReturnStatus, getOrderReturnStatusLabel } from "constantsapp";
import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { forceOrderUpdate, returnHistoryState } from "state";
import { Header, Page, Tabs } from "zmp-ui";
import ReturnHistoryList from "./list";
import styled from "styled-components";

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
  const StyledTabs = styled(Tabs)`
      .zaui-tabs-tabbar{
          position: fixed;
          top: 3rem;
      }
  `;
  return (
    <Page className="bg-background">
      <Header title="Lịch sử hoàn đơn" showBackIcon={true} />
      <StyledTabs className="w-full" id="contact-list">
        <StyledTabs.Tab
          key={EOrderReturnStatus.WAITING_CONFIRMATION}
          label={getOrderReturnStatusLabel(
            EOrderReturnStatus.WAITING_CONFIRMATION
          )}
        >
          <ReturnHistoryList orders={orderWaitingConfirm} />
        </StyledTabs.Tab>
        <StyledTabs.Tab
          key={EOrderReturnStatus.ACCEPT_RETURN}
          label={getOrderReturnStatusLabel(EOrderReturnStatus.ACCEPT_RETURN)}
        >
          <ReturnHistoryList orders={orderAcceptAccept} />
        </StyledTabs.Tab>
        <StyledTabs.Tab
          key={EOrderReturnStatus.REJECT_RETURN}
          label={getOrderReturnStatusLabel(EOrderReturnStatus.REJECT_RETURN)}
        >
          <ReturnHistoryList orders={orderRejectReturn} />
        </StyledTabs.Tab>
        <StyledTabs.Tab
          key={EOrderReturnStatus.COMPLETED}
          label={getOrderReturnStatusLabel(EOrderReturnStatus.COMPLETED)}
        >
          <ReturnHistoryList orders={orderComplete} />
        </StyledTabs.Tab>
      </StyledTabs>
    </Page>
  );
}

export default ReturnHistory;
