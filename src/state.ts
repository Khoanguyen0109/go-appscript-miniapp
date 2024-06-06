import { atom, selector, selectorFamily } from "recoil";
import {
  getAppInfo,
  getLocation,
  getPhoneNumber,
  getUserInfo,
  getSetting,
  authorize,
} from "zmp-sdk";
import logo from "static/logo.jpg";
import { Category } from "types/category";
import { Product } from "types/product";
import { Cart } from "types/cart";
import { Notification } from "types/notification";
import { calculateDistance } from "utils/location";
import { Store } from "types/delivery";
import { calcFinalPrice } from "utils/product";
import { wait } from "utils/async";
import supabase from "./client/client";
import { groupBy } from "lodash";
import { upsertUser } from "./api/addUser";
import { isToday, isTomorrow } from "date-fns";
import { dateSelectedState } from "./pages/cart/state";
import { ERoles } from "./constants";

export const mapProduct = (item) => {
  return {
    ...item,
    costdown: item.discount
      ? Number(item.price) - (Number(item.price) * Number(item.discount)) / 100
      : Number(item.price),
    variants: groupBy([...item.inventories], "group"),
    image: item.image.split(",").map((item) => ({ image: item })),
  };
};

export const authorizedState = selector({
  key: "authorized",
  get: async () => {
    const { authSetting } = await getSetting({});
    if (!authSetting["scope.userInfo"]) {
      await authorize({ scopes: [] });
    }
  },
});

export const userState = selector({
  key: "user",
  get: async ({ get }) => {
    get(authorizedState);
    const zaloUser = await getUserInfo({}).then((res) => res.userInfo);
    console.log("zaloUser", zaloUser);
    try {
      const data = upsertUser(zaloUser);
      return data;
    } catch (error) {
      return zaloUser;
    }
  },
});

const totalPointSelector = selector({
  key: "totalPointSelector",
  get: ({ get }) => {
    const user = get(userState);
    return user.totalPoint;
  },
});

const unCheckedPointSelector = selector({
  key: "unCheckedPointSelector",
  get: ({ get }) => {
    const user = get(userState);
    return user.uncheckedPoint;
  },
});

const checkedPointSelector = selector({
  key: "checkedPointSelector",
  get: ({ get }) => {
    const user = get(userState);
    return user.checkedPoint;
  },
});

export const userTotalPointState = atom({
  key: "userTotalPointState",
  default: totalPointSelector,
});

export const userUncheckedPointState = atom({
  key: "userUncheckedPointState",
  default: unCheckedPointSelector,
});

export const userCheckedPointState = atom({
  key: "userCheckedPointState",
  default: checkedPointSelector,
});

export const settingState = selector({
  key: "settings",
  get: async () => {
    const { data, error } = await supabase.from("settings").select();
    return data;
  },
});

export const minOrderItemSelector = selector({
  key: "minOrderItemSelector",
  get: ({ get }) => {
    const setting = get(settingState);
    return Number(setting.find((item) => item.name === "min").value) || 5;
  },
});

export const shippingFeeState = selector({
  key: "shippingFee",
  get: ({ get }) => {
    const setting = get(settingState);
    return (
      Number(setting.find((item) => item.name === "shippingFee").value) || 0
    );
  },
});

export const userPointTodayOrderSettingSelector = selector({
  key: "userPointTodayOrderSettingSelector",
  get: ({ get }) => {
    const setting = get(settingState);
    return (
      Number(setting.find((item) => item.name === "in_day_order").value) || 0
    );
  },
});

export const userPointTomorrowOrderSettingSelector = selector({
  key: "userPointTomorrowOrderSettingSelector",
  get: ({ get }) => {
    const setting = get(settingState);
    return (
      Number(setting.find((item) => item.name === "tomorrow_order").value) || 0
    );
  },
});

export const ctvPointOrderSelector = selector({
  key: "ctvPointOrderSelector",
  get: ({ get }) => {
    const setting = get(settingState);
    return (
      Number(
        setting.find((item) => item.name === "ctv_commission_order").value
      ) || 0
    );
  },
});

export const ctvPointWhenCustomerOrderSelector = selector({
  key: "ctvPointWhenCustomerOrderSelector",
  get: ({ get }) => {
    const setting = get(settingState);
    return (
      Number(
        setting.find((item) => item.name === "ctv_commission_customer_order")
          .value
      ) || 0
    );
  },
});

export const shipperPointSelector = selector({
  key: "shipperPointSelector",
  get: ({ get }) => {
    const setting = get(settingState);
    return (
      Number(setting.find((item) => item.name === "shipper_point").value) || 0
    );
  },
});

export const bankState = selector({
  key: "bankState",
  get: ({ get }) => {
    const setting = get(settingState);
    const bankInfoArr = setting.filter((item) => item.type === "bank");
    const bankInfo = {};
    bankInfoArr.forEach((item) => {
      bankInfo[item.name] = item.value;
    });
    return bankInfo;
  },
});
export const appInfoState = selector({
  key: "appInfo",
  get: async () => {
    return await getAppInfo({});
  },
});

export const categoriesState = selector<Category[]>({
  key: "categories",
  get: async () => {
    const { data } = await supabase.from("categories").select();
    return data;
  },
});

export const hotProductsState = selector<Product[]>({
  key: "hotProducts",
  get: async ({ get }) => {
    const { data, error } = await supabase
      .from("products")
      .select(`*, inventories: product_inventories(*)`)
      .eq("level", "Hot")
      .eq("active", true);
    return data?.map((item) => mapProduct(item));
  },
});
export const productsState = selector<Product[]>({
  key: "products",
  get: async ({ get }) => {
    const { data, error } = await supabase
      .from("products")
      .select(`*, inventories: product_inventories(*)`)
      .eq("active", true);
    return data?.map((item) => mapProduct(item));
  },
});

export const recommendProductsState = selector<Product[]>({
  key: "recommendProducts",
  get: ({ get }) => {
    const products = get(productsState);
    return products.filter((p) => p.sale);
  },
});

export const selectedCategoryIdState = atom({
  key: "selectedCategoryId",
  default: `1`,
});

export const productsByCategoryState = selectorFamily<Product[], string>({
  key: "productsByCategory",
  get:
    (categoryId) =>
    ({ get }) => {
      const allProducts = get(productsState);
      return allProducts.filter((product) => product.categoryId === categoryId);
    },
});

export const cartState = atom<Cart>({
  key: "cart",
  default: [],
});

export const discountState = atom({
  key: "voucher-discount",
  default: null,
});

export const totalQuantityState = selector({
  key: "totalQuantity",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => {
      if (!item.selected) {
        return total;
      }
      return total + item.quantity;
    }, 0);
  },
});

export function calDiscount(discount, total) {
  switch (discount.discountBy) {
    case "percent":
      return total - total * (parseInt(discount.discount) / 100);
    case "price":
      return total - parseInt(discount.discount);

    default:
      return 0;
  }
}

export const totalPriceState = selector({
  key: "totalPrice",
  get: ({ get }) => {
    const cart = get(cartState);
    const discount = get(discountState);
    const shippingFee = parseInt(get(shippingFeeState));
    if (cart.length === 0) {
      return 0;
    }
    const total =
      cart.reduce((total, item) => {
        if (!item.selected) {
          return total;
        }
        return (
          total + item.quantity * calcFinalPrice(item.product, item.options)
        );
      }, 0) + shippingFee;
    if (discount) {
      calDiscount(discount, total);
    }
    return total;
  },
});

export const preTotalPriceState = selector({
  key: "preTotalPriceState",
  get: ({ get }) => {
    const cart = get(cartState);
    const total = cart.reduce((total, item) => {
      if (!item.selected) {
        return total;
      }
      return total + item.quantity * calcFinalPrice(item.product, item.options);
    }, 0);

    return total;
  },
});

export const forceOrderUpdate = atom({
  key: "forceOrder",
  default: 0,
});

export const orderState = selector({
  key: "orders",
  get: async ({ get }) => {
    get(forceOrderUpdate);
    const user = get(userState);
    const { data, error } = await supabase
      .from("orders")
      .select(`* , orderDetails: order_details(* , product:products(*))`)
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    return data;
  },
});

const orderPointSelector = selector({
  key: "orderPointSelector",
  get: async ({ get }) => {
    get(forceOrderUpdate);
    const user = get(userState);

    const { data } = await supabase
      .from("orders")
      .select("*")
      .or(`userId.eq.${user.id},ctvId.eq.${user.id},shipperId.eq.${user.id}`);
    return data;
  },
});

export const userPointSelector = selector({
  key: "userPointSelector",
  get: ({ get }) => {
    const orders = get(orderPointSelector);
    return orders;
  },
});

export const notificationsState = atom<Notification[]>({
  key: "notifications",
  default: [
    {
      id: 1,
      image: logo,
      title: "Chào bạn mới",
      content:
        "Cảm ơn đã sử dụng Go Appscript ECommerce, bạn có thể dùng ứng dụng này để tiết kiệm thời gian xây dựng",
    },
    {
      id: 2,
      image: logo,
      title: "Giảm 50% lần đầu mua hàng",
      content: "Nhập WELCOME để được giảm 50% giá trị đơn hàng đầu tiên order",
    },
  ],
});

export const newNotificationState = selector({
  key: "newNotifications",
  get: async ({ get }) => {
    const { data } = await supabase
      .from("notifications")
      .select()
      .order("createdAt", { ascending: false });
    return data;
  },
});

export const notificationSelectedState = atom({
  key: "notificationSelectedState",
  default: null,
});

export const keywordState = atom({
  key: "keyword",
  default: "",
});

export const resultState = selector<Product[]>({
  key: "result",
  get: async ({ get }) => {
    const keyword = get(keywordState);
    if (!keyword.trim()) {
      return [];
    }
    const products = get(productsState);
    await wait(500);
    return products.filter((product) =>
      product.name.trim().toLowerCase().includes(keyword.trim().toLowerCase())
    );
  },
});

export const storesState = atom<Store[]>({
  key: "stores",
  default: [
    {
      id: 1,
      name: "VNG Campus Store",
      address:
        "Khu chế xuất Tân Thuận, Z06, Số 13, Tân Thuận Đông, Quận 7, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.741639,
      long: 106.714632,
    },
    {
      id: 2,
      name: "The Independence Palace",
      address:
        "135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.779159,
      long: 106.695271,
    },
    {
      id: 3,
      name: "Saigon Notre-Dame Cathedral Basilica",
      address:
        "1 Công xã Paris, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.779738,
      long: 106.699092,
    },
    {
      id: 4,
      name: "Bình Quới Tourist Village",
      address:
        "1147 Bình Quới, phường 28, Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.831098,
      long: 106.733128,
    },
    {
      id: 5,
      name: "Củ Chi Tunnels",
      address: "Phú Hiệp, Củ Chi, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 11.051655,
      long: 106.494249,
    },
  ],
});

export const nearbyStoresState = selector({
  key: "nearbyStores",
  get: ({ get }) => {
    // Get the current location from the locationState atom
    const location = get(locationState);

    // Get the list of stores from the storesState atom
    const stores = get(storesState);

    // Calculate the distance of each store from the current location
    if (location) {
      const storesWithDistance = stores.map((store) => ({
        ...store,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          store.lat,
          store.long
        ),
      }));

      // Sort the stores by distance from the current location
      const nearbyStores = storesWithDistance.sort(
        (a, b) => a.distance - b.distance
      );

      return nearbyStores;
    }
    return [];
  },
});

export const selectedStoreIndexState = atom({
  key: "selectedStoreIndex",
  default: 0,
});

export const selectedStoreState = selector({
  key: "selectedStore",
  get: ({ get }) => {
    const index = get(selectedStoreIndexState);
    const stores = get(nearbyStoresState);
    return stores[index];
  },
});

export const selectedDeliveryTimeState = atom({
  key: "selectedDeliveryTime",
  default: +new Date(),
});

export const requestLocationTriesState = atom({
  key: "requestLocationTries",
  default: 0,
});

export const requestPhoneTriesState = atom({
  key: "requestPhoneTries",
  default: 0,
});

export const locationState = selector<
  { latitude: string; longitude: string } | false
>({
  key: "location",
  get: async ({ get }) => {
    const requested = get(requestLocationTriesState);
    if (requested) {
      const { latitude, longitude, token } = await getLocation({
        fail: console.warn,
      });
      if (latitude && longitude) {
        return { latitude, longitude };
      }
      if (token) {
        console.warn(
          "Sử dụng token này để truy xuất vị trí chính xác của người dùng",
          token
        );
        console.warn(
          "Chi tiết tham khảo: ",
          "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
        );
        console.warn("Giả lập vị trí mặc định: VNG Campus");
        return {
          latitude: "10.7287",
          longitude: "106.7317",
        };
      }
    }
    return false;
  },
});

export const phoneState = selector<string | boolean>({
  key: "phone",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested) {
      const { number, token } = await getPhoneNumber({ fail: console.warn });
      if (number) {
        return number;
      }
      console.warn(
        "Sử dụng token này để truy xuất số điện thoại của người dùng",
        token
      );
      console.warn(
        "Chi tiết tham khảo: ",
        "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
      );
      console.warn("Giả lập số điện thoại mặc định: 0337076898");
      return "0337076898";
    }
    return false;
  },
});

export const searchState = atom<string | undefined>({
  key: "searchBdsState",
  default: undefined,
});

export const historySearchListState = atom<string[]>({
  key: "historySearchListState",
  default: [],
});

export const searchResultState = selector({
  key: "searchResultState",
  get: async ({ get }) => {
    const search = get(searchState);
    const formattedQuery = search.split(" ").join(" & ");

    if (search) {
      const { data, error } = await supabase
        .from("products")
        .select(`*, inventories: product_inventories(*)`)
        .eq("active", true)
        .filter("tsv_name", "fts(vietnamese)", formattedQuery);
      if (data) {
        return data.map((item) => mapProduct(item));
      }
      return [];
    }
    return [];
  },
});

export const globalProductInventoriesSelector = selector({
  key: "globalProductInventoriesSelector",
  get: async ({ get }) => {
    const { data } = await supabase
      .from("product_inventories")
      .select("*")
      .is("productId", null);
    if (data?.length) {
      return data;
    } else {
      return [];
    }
  },
});

export const calPointUserSelector = selector({
  key: "calPointUserSelector",
  get: ({ get }) => {
    const user = get(userState);
    const ctvPointOrder = get(ctvPointOrderSelector);
    const userPointInday = get(userPointTodayOrderSettingSelector);
    const userPointTomorrow = get(userPointTomorrowOrderSettingSelector);
    const convertDate = get(dateSelectedState);
    const isTodayOrder = isToday(convertDate);
    const isTomorrowOrder = isTomorrow(convertDate);
    if (user.role === ERoles.CTV) {
      return ctvPointOrder;
    } else {
      if (isTodayOrder) {
        return userPointInday;
      } else if (isTomorrowOrder) {
        return userPointTomorrow;
      }
    }
  },
});
