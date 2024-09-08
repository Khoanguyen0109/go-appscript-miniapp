import React, { FC, useEffect, useMemo } from "react";
import { Button, Header, Icon, Page, Text } from "zmp-ui";

import { followOA, getUserInfo, Payment } from "zmp-sdk";
import { OA_ID } from "enviroment";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "pages/route";
import Success from "assets/success.png";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { bankState, cartState, totalPriceState, userState } from "state";
import {
  addressSelectedState,
  noteState,
  selectedPaymentMethod,
} from "pages/cart/state";
import supabase from "../../client/client";
import logo from "static/logo.jpg";
import { isUndefined } from "lodash";
const PaymentSuccess: FC = () => {
  const { state } = useLocation();
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
    const zaloUser = await getUserInfo().then((res) => res.userInfo);
    const { error } = await supabase
      .from("users")
      .update({ followed: true, idUserToNotification: zaloUser.idByOA })
      .eq("id", user.id);
  };
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

  useEffect(() => {
    let data = state;
    if (data) {
      if ("path" in data) {
        data = data.path;
      } else if ("data" in data) {
        data = data.data;
      }
    } else {
      data = new URL(window.location.href).searchParams.toString();
    }
    // gọi api checkTransaction để lấy thông tin giao dịch
    Payment.checkTransaction({
      data,
      success: (rs) => {
        // Kết quả giao dịch khi gọi api thành công
        // const { id, resultCode, msg, transTime, createdAt } = rs;
        console.log("rs", rs);
        // // if(rs =)
        console.log("", rs.resultCode);
        if (isUndefined(rs?.resultCode) || rs.resultCode === -1) {
          return navigate(ROUTES.CART);
        }
      },
      fail: (err) => {
        // Kết quả giao dịch khi gọi api thất bại
        console.log(err);
      },
    });
  }, []);

  return (
    <Page className="flex flex-col bg-white">
      <div className="flex flex-1 flex-col justify-center align-middle p-10">
        <img src={logo} />

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
