import React, { FC } from "react";
import { Button, Header, Icon, Page, Text } from "zmp-ui";

import { followOA } from "zmp-sdk";
import { OA_ID } from "enviroment";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "pages/route";

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
      <Header title="Xác nhận" showBackIcon={false} />
      <div className="flex flex-1 flex-col justify-center align-middle p-10">
        <Text.Header className="mb-4 text-center">
          Đặt hàng thành công
        </Text.Header>
        <Icon
          icon="zi-check-circle"
          size={50}
          className="mx-auto text-green mb-10"
        />
        <Button variant="primary" onClick={onClick}>
          Tiếp tục
        </Button>
      </div>
    </Page>
  );
};

export default PaymentSuccess;
