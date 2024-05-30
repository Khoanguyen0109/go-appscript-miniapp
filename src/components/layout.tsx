import React, { FC, useEffect } from "react";
import { Route, Routes } from "react-router";
import { Box } from "zmp-ui";
import { Navigation } from "./navigation";
import HomePage from "pages/index";
import CategoryPage from "pages/category";
import CartPage from "pages/cart";
import NotificationPage from "pages/notification";
import ProfilePage from "pages/profile";
import { useNavigate } from "react-router-dom";
import size from "lodash/size";
import SearchPage from "pages/search";
import { getSystemInfo } from "zmp-sdk";
import { ScrollRestoration } from "./scroll-restoration";
import PaymentSuccess from "pages/payment/payment-success";
import { ROUTES } from "pages/route";
import Order from "pages/order/order";
import OrderDetail from "pages/order/order-detail";
import ProductDetail from "pages/product/product-detail";
import NotFound from "pages/error/not-found";
import UserAddress from "pages/user/user-address";
import AddUserAddress from "pages/user/add-user-address";
import OpenChat from "pages/chat";
import NotificationDetail from "pages/notification-detail";
import Commission from "pages/user/commission";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { settingState, userState } from "state";
import MemberInfo from "pages/user/member-info";
import { addressesState } from "pages/user/state";
import supabase from "../client/client";
import { useHandlePayment } from "../hooks/useHandlePayment";
import CheckoutResultPage from "../pages/cart/result";
import Search from "../pages/custom-search";
import SearchResult from "../pages/search-result";
import { addressSelectedState } from "../pages/cart/state";
import Income from "../pages/income";
import BankAccount from "../pages/user/bank-account";
import Shipping from "../pages/shipping";
import LoadingScreenOverLay from "./loading-screen";
import { ERoles } from "../constants";

if (getSystemInfo().platform === "android") {
  // const androidSafeTop = Math.round(
  //   (window as any).ZaloJavaScriptInterface.getStatusBarHeight() /
  //     window.devicePixelRatio
  // );
  document.body.style.setProperty("--zaui-safe-area-inset-top", `${20}px`);
}

export const Layout: FC = () => {
  // useHandlePayment();
  useRecoilValueLoadable(settingState);
  const userStateLoadable = useRecoilValueLoadable(userState);
  const addresses = useRecoilValueLoadable(addressesState);
  const [address, setAddressSelected] = useRecoilState(addressSelectedState);

  const navigate = useNavigate();
  const paramsSearch = new URLSearchParams(location.search);
  const ctvId = paramsSearch.get("id_ctv_shared");
  const saveCTV = async (ctvId) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ idCTVShared: ctvId })
        .eq("id", userStateLoadable.contents.id);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (ctvId && userStateLoadable.state === "hasValue") {
      saveCTV(ctvId);
    }
  }, []);

  useEffect(() => {
    if (size(addresses) && addresses && addresses.state === "hasValue") {
      setAddressSelected(addresses.contents[0]);
    }
  }, [addresses]);

  useEffect(() => {
    if (userStateLoadable.contents.role === ERoles.SHIPPER) {
      navigate(ROUTES.SHIPPING);
    }
  }, [userStateLoadable.contents?.role]);
  if (userStateLoadable.state === "loading") {
    return <LoadingScreenOverLay />;
  }
  if (userStateLoadable.state === "hasError") {
    return navigate(ROUTES.NOT_FOUND);
  } else {
    return (
      <Box flex flexDirection="column" className="h-screen">
        <ScrollRestoration />
        <Box className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />}></Route>
            <Route path={ROUTES.SEARCH} element={<Search />}></Route>
            <Route
              path={ROUTES.SEARCH_RESULT}
              element={<SearchResult />}
            ></Route>

            <Route path="/category" element={<CategoryPage />}></Route>
            <Route path="/notification" element={<NotificationPage />}></Route>
            <Route path="/cart" element={<CartPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/openChat" element={<OpenChat />}></Route>

            <Route
              path={ROUTES.PRODUCT_DETAIL(":id")}
              element={<ProductDetail />}
            ></Route>
            <Route path={ROUTES.SHIPPING} element={<Shipping />}></Route>
            <Route
              path={ROUTES.PAYMENT_SUCCESS}
              element={<PaymentSuccess />}
            ></Route>
            <Route path={ROUTES.ORDER} element={<Order />}></Route>
            <Route
              path={ROUTES.ORDER_DETAIL(":id")}
              element={<OrderDetail />}
            ></Route>
            <Route path={ROUTES.USER_ADDRESS} element={<UserAddress />}></Route>
            <Route
              path={ROUTES.USER_ADDRESS_ADD}
              element={<AddUserAddress />}
            ></Route>
            <Route
              path={ROUTES.USER_ADDRESS_ADD}
              element={<UserAddress />}
            ></Route>
            <Route
              path={ROUTES.NOTIFICATION(":id")}
              element={<NotificationDetail />}
            ></Route>
            <Route path={ROUTES.COMMISSION} element={<Commission />}></Route>
            <Route path={ROUTES.MEMBER_CARD} element={<MemberInfo />}></Route>
            <Route
              path={ROUTES.RESULT}
              element={<CheckoutResultPage />}
            ></Route>
            <Route path={ROUTES.INCOME} element={<Income />}></Route>
            <Route path={ROUTES.BANK_ACCOUNT} element={<BankAccount />}></Route>

            <Route path={ROUTES.NOT_FOUND} element={<NotFound />}></Route>
          </Routes>
        </Box>
        <Navigation />
      </Box>
    );
  }
};
