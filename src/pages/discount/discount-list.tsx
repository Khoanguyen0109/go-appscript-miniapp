import React, { useState } from "react";
import { Box, Header, Modal, Page, Text } from "zmp-ui";
import { DisplayCoinNoMoney } from "../../components/display/display-coin-with-no-money";
import { CiDiscount1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { userState, userTotalPointState } from "../../state";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  payableDiscountSelector,
  userVouchersState,
} from "../../state/discount-state";
import DiscountItem from "../../components/discount-item";
import logo from "static/logo.jpg";
import useCustomSnackbar from "../../hooks/useCustomSnackbar";
import { ROUTES } from "../route";
import supabase from "../../client/client";
import { TDiscount } from "../../types/discount";
import { EUserVoucherStatus } from "../../constantsapp";
type Props = {};

function DiscountList({}: Props) {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const discounts = useRecoilValue(payableDiscountSelector);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectDiscount, setSelectDiscount] = useState<null | TDiscount>(null);
  const { openSnackbar } = useCustomSnackbar();

  const [userVouchers, setUserVouchers] = useRecoilState(userVouchersState);
  const [userTotalPoint, setUserTotalPoint] =
    useRecoilState(userTotalPointState);

  const onClickRedeem = (item) => {
    if (userTotalPoint < item.point) {
      return openSnackbar({
        text: "Bạn không đủ điểm cho voucher này!",
        type: "error",
        icon: true,
        duration: 2000,
      });
    }
    setSelectDiscount(item);
    setConfirmModalVisible(true);
  };

  const handleRedeem = async () => {
    if (selectDiscount) {
      try {
        const pointLess = userTotalPoint - selectDiscount.point;
        setUserTotalPoint(pointLess);

        const { data } = await supabase
          .from("user_vouchers")
          .insert({
            userId: user.id,
            discountId: selectDiscount.id,
            status: EUserVoucherStatus.UNUSED,
          })
          .select("*, discounts(*)");
        if (data?.length) {
          setUserVouchers([...userVouchers, data[0]]);
        }
        await supabase
          .from("users")
          .update({ totalPoint: pointLess })
          .eq("id", user.id);
        setConfirmModalVisible(false);
        setSelectDiscount(null);
        return openSnackbar({
          text: "Bạn đã thu thập cho voucher này!",
          type: "success",
          icon: true,
          duration: 2000,
        });
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  return (
    <Page>
      <Header title="Ưu đãi" showBackIcon={true}></Header>

      <Box className="flex justify-between items-center p-2 py-4 mb-3 bg-yellow-400 text-white">
        <Box>
          <Text>Điểm có thể sử dụng</Text>
          <Text>
            <DisplayCoinNoMoney>{userTotalPoint}</DisplayCoinNoMoney>
          </Text>
        </Box>
        <Box
          className="!flex  !bg-white text-yellow-400 p-2 rounded-full items-center font-bold"
          onClick={() => navigate(ROUTES.USER_VOUCHER)}
        >
          <CiDiscount1 className="font-bold" />
          <Text className="ml-1 font-semibold">Ưu đãi của tôi</Text>
        </Box>
      </Box>

      <Box className="p-2">
        {discounts.map((item) => (
          <DiscountItem
            key={item.id}
            item={item}
            onClickRedeem={onClickRedeem}
          />
        ))}
      </Box>

      <Modal
        visible={confirmModalVisible}
        title="Đổi voucher"
        coverSrc={logo}
        description={`Bạn xác nhận đổi voucher ${selectDiscount?.title}`}
        actions={[
          {
            text: "Huỷ",
            onClick: () => {
              setConfirmModalVisible(false);
              setSelectDiscount(null);
            },
          },
          {
            highLight: true,
            text: "Đồng ý",
            onClick: () => {
              handleRedeem();
            },
          },
        ]}
      ></Modal>
    </Page>
  );
}

export default DiscountList;
