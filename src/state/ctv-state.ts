import { atom, selector } from "recoil";
import { userState } from "../state";
import supabase from "../client/client";
import { ECommissionRequest } from "../constants";

export const ctvIncomeListRequestSelector = selector({
  key: "ctvIncomeListRequestSelector",
  get: async ({ get }) => {
    try {
      const user = get(userState);
      const { data } = await supabase
        .from("commission_requests")
        .select("*")
        .eq("userId", user.id);
      return [
        {
          status: ECommissionRequest.DONE,
          total: 500,
          createdAt: '30/05/2024',
        },
        {
          status: ECommissionRequest.DONE,
          total: 500,
          createdAt: '30/05/2024',
        },
      ];
      console.log("data", data);
    } catch (error) {
      return [];
    }
  },
});

export const ctvIncomeListRequestState = atom({
  key: "ctvIncomeListRequestState",
  default: ctvIncomeListRequestSelector,
});
