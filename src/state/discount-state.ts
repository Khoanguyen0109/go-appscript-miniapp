import { atom, selector } from "recoil";
import supabase from "../client/client";
import { userState } from "../state";
import { isNull } from "lodash";
import { EUserVoucherStatus } from "../constantsapp";

export const discountListSelector = selector({
  key: "discountListSelector",
  get: async () => {
    const { data } = await supabase
      .from("discounts")
      .select("*")
      .eq("active", true);
    return data || [];
  },
});

export const discountBannersSelector = selector({
  key: "discountBannersSelector",
  get: ({ get }) => {
    const discounts = get(discountListSelector);
    return discounts.filter((item) => !isNull(item.thumbnail));
  },
});

export const publicDiscountSelector = selector({
  key: "publicDiscountSelector",
  get: ({ get }) => {
    const discounts = get(discountListSelector);
    return discounts.filter((item) => Boolean(item.public));
  },
});

export const payableDiscountSelector = selector({
  key: "payableDiscountSelector",
  get: ({ get }) => {
    const discounts = get(discountListSelector);
    return discounts.filter((item) => !Boolean(item.public));
  },
});

export const userVouchersSelector = selector({
  key: "userVouchersSelector",
  get: async ({ get }) => {
    const user = get(userState);
    const { data } = await supabase
      .from("users")
      .select(`*, user_vouchers(*, discounts(*))`)
      .eq("id", user.id)
      .eq("memberClass", user.memberClass)
      .single();
    return data.user_vouchers.filter(
      (item) => item.status !== EUserVoucherStatus.USED
    );
  },
});

export const userVouchersState = atom({
  key: "userVouchersState",
  default: userVouchersSelector,
});
