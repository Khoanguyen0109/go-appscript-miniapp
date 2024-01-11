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
import { axiosInstance } from "api/instance";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { userState } from "state";

if (getSystemInfo().platform === "android") {
  const androidSafeTop = Math.round(
    (window as any).ZaloJavaScriptInterface.getStatusBarHeight() /
      window.devicePixelRatio
  );
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`
  );
}

export const Layout: FC = () => {
  const userStateLoadable = useRecoilValueLoadable(userState);
  const user = useRecoilValueLoadable(userState);
  const navigate = useNavigate();
  const paramsSearch = new URLSearchParams(location.search);
  const ctvId = paramsSearch.get("id_ctv_shared");
  const saveCTV = async (ctvId) => {
    try {
      const res = await axiosInstance.put(`/users/${user.id}/ctv_update`, {
        ctvId,
        user,
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (ctvId) {
      saveCTV(ctvId);
    }
  }, []);
  if (userStateLoadable.state === "hasError") {
    return navigate(ROUTES.NOT_FOUND);
  } else {
    return (
      <Box flex flexDirection="column" className="h-screen">
        <ScrollRestoration />
        <Box className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />}></Route>
            <Route path="/search" element={<SearchPage />}></Route>
            <Route path="/category" element={<CategoryPage />}></Route>
            <Route path="/notification" element={<NotificationPage />}></Route>
            <Route path="/cart" element={<CartPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/openChat" element={<OpenChat />}></Route>

            <Route
              path={ROUTES.PRODUCT_DETAIL(":id")}
              element={<ProductDetail />}
            ></Route>

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

            <Route path={ROUTES.NOT_FOUND} element={<NotFound />}></Route>
          </Routes>
        </Box>
        <Navigation />
      </Box>
    );
  }
};
