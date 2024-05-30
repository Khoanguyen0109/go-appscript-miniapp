import { atom, selector } from "recoil";
import { EOrderStatus } from "../constantsapp";
import { userState } from "../state";
import supabase from "../client/client";

export const selectedShippingStatusState = atom({
  key: "selectedShippingStatusState",
  default: "waiting",
});

export const shippingListSelector = selector({
  key: "shippingListSelector",
  get: async ({ get }) => {
    try {
      // const user = get(userState);
      // const { data, error } = await supabase.rpc("custom_query", {
      //   query: `
      //   SELECT
      //       *
      //       users.name,
      //       user_addresses.address,
      //       user_addresses.province,
      //       user_addresses.district,
      //       user_addresses.ward,
      //       user_addresses.phone,

      //   WHERE shipperId =${user.id}  
      //   FROM
      //       orders
      //   JOIN
      //       users ON orders.userId = users.id
      //   JOIN
      //       user_addresses ON user_addresses.id = orders.addressId
      //   `,
      // });
      console.log("data", data);
      return [];
    } catch (error) {
      console.log("error", error);
      return [];
    }
  },
});

export const shippingListState = atom({
  key: "shippingListState",
  default: shippingListSelector,
});

export const shippingListSelectorByStatus = selector({
  key: "shippingListSelectorByStatus",
  get: ({ get }) => {
    const currentStatus = get(selectedShippingStatusState);
    const shippingList = get(shippingListState);
    console.log("shippingList", shippingList);
    const orders = shippingList?.filter(
      (item) => item.status === currentStatus
    );
    return orders;
  },
});
