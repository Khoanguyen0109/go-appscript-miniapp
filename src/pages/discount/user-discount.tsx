import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, Header, Page, Text, useSnackbar } from "zmp-ui";
import supabase from "../../client/client";
import DiscountItem from "../../components/discount-item";
import { EUserVoucherStatus } from "../../constantsapp";
import { discountState, userState } from "../../state";
import {
  publicDiscountSelector,
  userVouchersState,
} from "../../state/discount-state";
import { voucherSelectedState } from "../cart/state";
import { ROUTES } from "../route";

type Props = {};

function UserDiscount({}: Props) {
  const navigate = useNavigate();
  const userVoucherList = useRecoilValue(userVouchersState);
  const publicVoucher = useRecoilValue(publicDiscountSelector);
  const user = useRecoilValue(userState);
  const [voucherSelected, setVoucherSelected] =
    useRecoilState(voucherSelectedState);
  let [searchParams, setSearchParams] = useSearchParams();
  const isRouteFromCart = searchParams.get("routeFrom") === "cart";
  const [discount, setDiscount] = useRecoilState(discountState);
  console.log("voucherSelected", voucherSelected);
  const voucherParsed =
    userVoucherList?.filter(
      (discount) =>
        discount.memberClass === null ||
        discount.memberClass !== user.memberClass
    ) || [];
  const memberClassVoucher =
    userVoucherList?.filter(
      (discount) => discount.memberClass === user.memberClass
    ) || [];
  const { openSnackbar } = useSnackbar();
  const onChoose = async (item) => {
    if (isRouteFromCart) {
      if (item.public) {
        const { data: existingVoucher } = await supabase
          .from("user_vouchers")
          .select()
          .eq("userId", user.id)
          .eq("discountId", item.id)
          .maybeSingle();

        if (
          existingVoucher &&
          existingVoucher.status === EUserVoucherStatus.USED
        ) {
          return openSnackbar({
            text: "Bạn đã đổi voucher này rồi!",
            type: "warning",
            icon: true,
            duration: 2000,
          });
        } else {
          const { data } = await supabase
            .from("user_vouchers")
            .insert({
              userId: user.id,
              discountId: item.id,
              status: EUserVoucherStatus.UNUSED,
              thumbnail: item.thumbnail,
              discountBy: item.discountBy,
              discount: item.discount,
            })
            .select("*, discounts(*)");

          setDiscount(item);
          setVoucherSelected(item);
          navigate(ROUTES.CART);
        }
      } else {
        setDiscount(item);
        setVoucherSelected(item);
        navigate(ROUTES.CART);
      }
    }
  };
  const onBack = () => {
    if (isRouteFromCart) {
      navigate(ROUTES.CART);
    } else {
      navigate(-1);
    }
  };

  return (
    <Page>
      <Header title="Ưu đãi của tôi" showBackIcon={true} onBackClick={onBack} />
      <Box className="p-2 mt-4">
        {voucherParsed.map((item) => (
          <DiscountItem
            key={item.id}
            item={item}
            onChoose={isRouteFromCart ? onChoose : undefined}
            onUpdateItem={() => {
              setVoucherSelected(item);
            }}
          />
        ))}
      </Box>
      {isRouteFromCart && publicVoucher.length > 0 && (
        <Box className="p-2 mt-4">
          <Text className="font-bold mb-3">Mã khuyến mãi của cửa hàng</Text>
          {publicVoucher.map((item) => (
            <DiscountItem
              key={item.id}
              item={item}
              onChoose={onChoose}
              onUpdateItem={() => {
                setVoucherSelected(item);
              }}
            />
          ))}
        </Box>
      )}
      {isRouteFromCart && publicVoucher.length > 0 && (
        <Box className="p-2 mt-4">
          <Text className="font-bold mb-3">Mã khuyến mãi của Thứ hạng</Text>
          {memberClassVoucher.map((item) => (
            <DiscountItem
              key={item.id}
              item={item}
              onChoose={onChoose}
              onUpdateItem={() => {
                setVoucherSelected(item);
              }}
            />
          ))}
        </Box>
      )}
    </Page>
  );
}

export default UserDiscount;
