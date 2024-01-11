import React, { FC, useMemo } from "react";
import { Button, Header, Icon, Page, Text } from "zmp-ui";

import { followOA } from "zmp-sdk";
import { OA_ID } from "enviroment";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "pages/route";
import Success from "assets/success.png";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { bankState, cartState, totalPriceState, userState } from "state";
import {
  addressSelectedState,
  noteState,
  selectedPaymentMethod,
} from "pages/cart/state";
import { axiosInstance } from "api/instance";
const PaymentSuccess: FC = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [note, setNote] = useRecoilState(noteState);
  const [address, setAddressSelected] = useRecoilState(addressSelectedState);
  const totalPrice = useRecoilValue(totalPriceState);
  const resetCart = useResetRecoilState(cartState);

  const [paymentMethod, setPaymentMethod] = useRecoilState(
    selectedPaymentMethod
  );
  const backHome = () => {
    setAddressSelected(null);
    setPaymentMethod(null);
    setNote("");
    resetCart();
    navigate(ROUTES.HOME);
  };
  const updateFollowed = async () => {
    const rest = await axiosInstance.put(
      `/users/${user.id}/update_followed`,
      {}
    );
  };
  const bankInfo = useRecoilValue(bankState);
  const onClick = async () => {
    if (!user?.followed) {
      return await followOA({
        id: OA_ID,
        success: () => {
          updateFollowed();
          backHome();
        },
        fail: () => {
          backHome();
        },
      });
    }
    return backHome();
  };

  const qrImage = useMemo(() => {
    const { bank, account, name } = bankInfo;
    return `https://img.vietqr.io/image/${bank}-${account}-compact2.jpg?amount=${totalPrice}&addInfo=${"Chuyen khoan app zalo"}&accountName=${name}`;
  }, []);

  return (
    <Page className="flex flex-col">
      <div className="flex flex-1 flex-col justify-center align-middle p-10">
        {paymentMethod?.value === "chuyen_khoan" ? (
          <img src={qrImage} />
        ) : (
          <img src={Success} />
        )}
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
