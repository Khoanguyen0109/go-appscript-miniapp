import { atom, selector, selectorFamily } from "recoil";
import { getAppInfo, getLocation, getPhoneNumber, getUserInfo } from "zmp-sdk";
import coffeeIcon from "static/category-coffee.svg";
import matchaIcon from "static/category-matcha.svg";
import foodIcon from "static/category-food.svg";
import milkteaIcon from "static/category-milktea.svg";
import drinksIcon from "static/category-drinks.svg";
import breadIcon from "static/category-bread.svg";
import juiceIcon from "static/category-juice.svg";
import logo from "static/logo.jpg";
import { Category, CategoryId } from "types/category";
import { Product, Variant } from "types/product";
import { Cart } from "types/cart";
import { Notification } from "types/notification";
import { calculateDistance } from "utils/location";
import { Store } from "types/delivery";
import { calcFinalPrice, getDummyImage } from "utils/product";
import { wait } from "utils/async";
import { axiosInstance } from "api/instance";

export const userState = selector({
  key: "user",
  get: async () => {
    const zaloUser = await getUserInfo({}).then((res) => res.userInfo);
    try {
      const res = await axiosInstance.get(`/users/${zaloUser.id}`);

      return { ...res.data.data, ...zaloUser };
    } catch (error) {
      return zaloUser;
    }
  },
});

export const settingState = selector({
  key: "settings",
  get: async () => {
    const res = await axiosInstance.get(`/settings/`);
    return res.data.data;
  },
});

export const shippingFeeState = selector({
  key: "shippingFee",
  get: ({ get }) => {
    const setting = get(settingState);
    return setting.find((item) => item.name === "shippingFee").value || 0;
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
  get: ({ get }) => {
    const setting = get(settingState);
    const categories = setting.filter((item) => item.type === "categories");
    return categories;
  },
});

const description = `There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes`;

export const hotProductsState = selector<Product[]>({
  key: "hotProducts",
  get: async ({}) => {
    const res = await axiosInstance.get("/products");
    return res.data.hotProducts;
  },
});
export const productsState = selector<Product[]>({
  key: "products",
  get: async () => {
    const res = await axiosInstance.get("/products");
    return res.data.data;
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
  default: "coffee",
});

export const productsByCategoryState = selectorFamily<Product[], string>({
  key: "productsByCategory",
  get:
    (categoryId) =>
    ({ get }) => {
      const allProducts = get(productsState);
      return allProducts.filter((product) =>
        product.category_id.includes(categoryId)
      );
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
      switch (discount.discount_by) {
        case "percent":
          return total - total * (parseInt(discount.discount) / 100);
        case "price":
          return total - parseInt(discount.discount);

        default:
          break;
      }
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
    const res = await axiosInstance.get(`/orders/${user.id}`, {
      params: { limit: 50 },
    });
    return res.data?.data || [];
  },
});

export const orderDetailState = selector({
  key: "orderDetail",
  get: async ({ get }) => {
    const user = get(userState);
    const res = await axiosInstance.get(`/orders/${user.id}`, {
      params: { limit: 50 },
    });
    return res.data?.data || [];
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
    const { id } = get(userState);
    const res = await axiosInstance.get(`users/${id}/notifications`);
    return res.data.data;
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
