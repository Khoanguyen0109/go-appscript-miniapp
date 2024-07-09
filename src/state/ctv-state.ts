import { atom, selector } from "recoil";
import { userState } from "../state";
import supabase from "../client/client";

export const ctvIncomeListRequestSelector = selector({
  key: "ctvIncomeListRequestSelector",
  get: async ({ get }) => {
    try {
      const user = get(userState);
      const { data } = await supabase
        .from("commission_requests")
        .select("*")
        .eq("userId", user.id);
      return data || [];
    } catch (error) {
      return [];
    }
  },
});

export const ctvIncomeListRequestState = atom({
  key: "ctvIncomeListRequestState",
  default: ctvIncomeListRequestSelector,
});

export const userListOfCTVSelector = selector({
  key: "userListOfCTV",
  get: async ({ get }) => {
    const user = get(userState);
    const { data } = await supabase
      .from("users")
      .select(`*, user_addresses(*)`)
      .eq("idCTVShared", user.id);
    if (data?.length) {
      return data;
    }
    return [];
  },
});

export const userAddressOfCTVSelector = selector({
  key: "userAddressOfCTVSelector",
  get: ({ get }) => {
    const list = get(userListOfCTVSelector);
    if (list.length) {
      const addresses = list.reduce((acc, value) => {
        value.user_addresses.forEach((item) => {
          acc.push(item);
        });
        return acc;
      }, []);
      return addresses;
    }

    return [];
  },
});
