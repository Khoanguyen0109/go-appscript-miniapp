import size from "lodash/size";
import CartPage from "pages/cart";
import CategoryPage from "pages/category";
import OpenChat from "pages/chat";
import NotFound from "pages/error/not-found";
import HomePage from "pages/index";
import NotificationPage from "pages/notification";
import NotificationDetail from "pages/notification-detail";
import Order from "pages/order/order";
import OrderDetail from "pages/order/order-detail";
import PaymentSuccess from "pages/payment/payment-success";
import ProductDetail from "pages/product/product-detail";
import ProfilePage from "pages/profile";
import { ROUTES } from "pages/route";
import AddUserAddress from "pages/user/add-user-address";
import Commission from "pages/user/commission";
import MemberInfo from "pages/user/member-info";
import { addressesState } from "pages/user/state";
import UserAddress from "pages/user/user-address";
import React, { FC, useEffect } from "react";
import { Route, Routes } from "react-router";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { settingState, userState } from "state";
import { getSystemInfo } from "zmp-sdk";
import { Box } from "zmp-ui";
import supabase from "../client/client";
import { ERoles } from "../constants";
import CheckoutResultPage from "../pages/cart/result";
import { addressSelectedState } from "../pages/cart/state";
import AllCategoriesPage from "../pages/category/all-category";
import Search from "../pages/custom-search";
import DiscountList from "../pages/discount/discount-list";
import UserDiscount from "../pages/discount/user-discount";
import EditCart from "../pages/edit-cart/edit-cart";
import EditCartPage from "../pages/edit-cart/edit-cart";
import Income from "../pages/income";
import AllProductPage from "../pages/product/all-product";
import RequestCommission from "../pages/request-commission";
import CreateReturnPage from "../pages/return/create";
import ReturnHistory from "../pages/return/history";
import { ReturnReview } from "../pages/return/preview";
import Return from "../pages/return/return";
import ReturnDetail from "../pages/return/return-detail";
import ReturnSuccess from "../pages/return/success";
import SearchResult from "../pages/search-result";
import Shipping from "../pages/shipping";
import ShippingDetail from "../pages/shipping/shipping-detail";
import BankAccount from "../pages/user/bank-account";
import CTVUserList from "../pages/user/ctv-user-list";
import LoadingScreenOverLay from "./loading-screen";
import { Navigation } from "./navigation";
import { ScrollRestoration } from "./scroll-restoration";
import { useHandlePayment } from "../hooks";

if (getSystemInfo().platform === "android") {
  // const androidSafeTop = Math.round(
  //   (window as any).ZaloJavaScriptInterface.getStatusBarHeight() /
  //     window.devicePixelRatio
  // );
  // document.body.style.setProperty(
  //   "--zaui-safe-area-inset-top",
  //   `${10}px`
  // );
}
export const Layout: FC = () => {
  useHandlePayment();

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
    if (
      size(addresses) &&
      addresses &&
      addresses.state === "hasValue" &&
      userStateLoadable?.contents.role !== ERoles.CTV
    ) {
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
            <Route path="/all-products" element={<AllProductPage />}></Route>
            <Route path="/all-category" element={<AllCategoriesPage />}></Route>
            <Route path="/notification" element={<NotificationPage />}></Route>
            <Route path="/edit-cart/:id" element={<EditCartPage />}></Route>
            <Route path="/cart" element={<CartPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/openChat" element={<OpenChat />}></Route>

            <Route
              path={ROUTES.PRODUCT_DETAIL(":id")}
              element={<ProductDetail />}
            ></Route>
            <Route path={ROUTES.SHIPPING} element={<Shipping />}></Route>
            <Route
              path={ROUTES.SHIPPING_DETAIL}
              element={<ShippingDetail />}
            ></Route>
            <Route
              path={ROUTES.CTV_USER_LIST}
              element={<CTVUserList />}
            ></Route>

            <Route
              path={ROUTES.PAYMENT_SUCCESS}
              element={<PaymentSuccess />}
            ></Route>
            <Route path={ROUTES.ORDER} element={<Order />}></Route>
            <Route path={ROUTES.RETURN} element={<Return />}></Route>
            <Route
              path={ROUTES.RETURN_REVIEW}
              element={<CreateReturnPage />}
            ></Route>
            <Route
              path={ROUTES.RETURN_HISTORY}
              element={<ReturnHistory />}
            ></Route>
            <Route
              path={ROUTES.RETURN_SUCCESS}
              element={<ReturnSuccess />}
            ></Route>
            <Route
              path={ROUTES.RETURN_DETAIL(":id")}
              element={<ReturnDetail />}
            ></Route>
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
              path={ROUTES.USER_ADDRESS_EDIT}
              element={<AddUserAddress mode={"edit"} />}
            ></Route>
            {/* <Route
              path={ROUTES.USER_ADDRESS_ADD}
              element={<UserAddress />}
            ></Route> */}
            <Route
              path={ROUTES.NOTIFICATION(":id")}
              element={<NotificationDetail />}
            ></Route>
            <Route path={ROUTES.COMMISSION} element={<Commission />}></Route>
            <Route
              path={ROUTES.REQUEST_COMMISSION}
              element={<RequestCommission />}
            ></Route>

            <Route path={ROUTES.MEMBER_CARD} element={<MemberInfo />}></Route>
            <Route
              path={ROUTES.RESULT}
              element={<CheckoutResultPage />}
            ></Route>
            <Route path={ROUTES.INCOME} element={<Income />}></Route>
            <Route path={ROUTES.BANK_ACCOUNT} element={<BankAccount />}></Route>
            <Route path={ROUTES.BUY_VOUCHER} element={<DiscountList />}></Route>
            <Route
              path={ROUTES.USER_VOUCHER}
              element={<UserDiscount />}
            ></Route>

            <Route path={ROUTES.NOT_FOUND} element={<NotFound />}></Route>
          </Routes>
        </Box>
        <Navigation />
      </Box>
    );
  }
};
