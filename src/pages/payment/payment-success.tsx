import React, { FC } from "react";
import { Button, Header, Icon, Page, Text } from "zmp-ui";

import { followOA } from "zmp-sdk";
import { OA_ID } from "enviroment";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "pages/route";
import Success from "assets/success.png";
const PaymentSuccess: FC = () => {
  const navigate = useNavigate();
  const backHome = () => {
    navigate(ROUTES.HOME);
  };
  const onClick = async () => {
    await followOA({
      id: OA_ID,
      success: () => {
        backHome();
      },
      fail: () => {
        backHome();
      },
    });
  };
  return (
    <Page className="flex flex-col">
      <div className="flex flex-1 flex-col justify-center align-middle p-10">
        <img src={Success} />
        <Text.Header className="mb-4 text-center mt-4 font-bold text-lg">
          Đặt hàng thành công
        </Text.Header>
      
        <Button variant="primary" onClick={onClick}>
          Tiếp tục
        </Button>
      </div>
    </Page>
  );
};

export default PaymentSuccess;
