import {useVirtualKeyboardVisible} from "hooks";
import React, {FC, useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {MenuItem} from "types/menu";
import {BottomNavigation} from "zmp-ui";
import {CartIcon} from "./icon/cart-icon";
import {BsFillCartFill} from "react-icons/bs";
import {BiSolidUser, BiUser} from "react-icons/bi";
import {ROUTES} from "pages/route";
import {useRecoilValue} from "recoil";
import {userState} from "../state";
import {ERoles} from "../constants";
import userCircleIcon from "static/icons/userCircle.svg";
import searchIcon from "static/icons/search.svg";
import returnIcon from "static/icons/return.svg";
import chatOaIcon from "static/icons/chatOa.svg";
import cartIcon from "static/icons/cart.svg";
import homeIcon from "static/icons/home.svg";



export const NO_BOTTOM_NAVIGATION_PAGES = [
  "/search",
  "/products",
  ROUTES.PAYMENT_SUCCESS,
];

export const Navigation: FC = () => {
  const user = useRecoilValue(userState);
  const [activeTab, setActiveTab] = useState<TabKeys>(
    user.role === ERoles.SHIPPER ? ROUTES.SHIPPING : "/"
  );
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate();
  const location = useLocation();
  const noBottomNav = useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [noBottomNav]);

  if (noBottomNav || keyboardVisible) {
    return <></>;
  }
  const tabs: Record<string, MenuItem> = {
    "/": {
      label: "Trang chủ",
      icon: <img src={homeIcon} alt="Home"/>,
      activeIcon: <img src={homeIcon} alt="Home" className={'nav-primary-color'}/>,
    },
    ...(user.role === 'Đối tác' ? {
      "/return": {
        label: "Hoàn đơn",
        icon: <img src={returnIcon} alt="Return"/>,
        activeIcon: <img src={returnIcon} alt="Return" className={'nav-primary-color'}/>,
      },
    } : {}),
    // "/search": {
    //   label: "Tìm kiếm",
    //   icon: <img src={searchIcon} alt="Search"/>,
    //   activeIcon: <img src={searchIcon} alt="Search" className={'nav-primary-color'}/>,
    // },
    "/cart": {
      label: "Giỏ hàng",
      icon: <CartIcon/>,
      activeIcon: <CartIcon active/>,
    },
    "/openChat": {
      label: "Chat OA",
      icon: <img src={chatOaIcon} alt="Chat OA"/>,
      activeIcon: <img src={chatOaIcon} alt="Chat OA" className={'nav-primary-color'}/>,
    },
    "/profile": {
      label: "Cá nhân",
      icon: <img src={userCircleIcon} alt="User Circle"/>,
      activeIcon: <img src={userCircleIcon} alt="User Circle" className={'nav-primary-color'}/>,
    },
  };
  type TabKeys = keyof typeof tabs;

  if (user.role === ERoles.SHIPPER) {
    return (
      <BottomNavigation
        id="footer"
        activeKey={activeTab}
        onChange={(key: TabKeys) => setActiveTab(key)}
        className="z-50"
      >
        <BottomNavigation.Item
          key={ROUTES.SHIPPING}
          label={"Đơn hàng"}
          icon={<CartIcon/>}
          activeIcon={<BsFillCartFill/>}
          onClick={() => navigate(ROUTES.SHIPPING)}
        />
        <BottomNavigation.Item
          key={"/profile"}
          label={"Tài khoản"}
          icon={<BiUser/>}
          activeIcon={<BiSolidUser/>}
          onClick={() => navigate("/profile")}
        />
      </BottomNavigation>
    );
  }

  return (
    <BottomNavigation
      id="footer"
      activeKey={activeTab}
      onChange={(key: TabKeys) => setActiveTab(key)}
      className="z-50"
    >
      {Object.keys(tabs).map((path: TabKeys) => (
        <BottomNavigation.Item
          key={path}
          label={tabs[path].label}
          icon={tabs[path].icon}
          activeIcon={tabs[path].activeIcon}
          onClick={() => navigate(path)}
        />
      ))}
    </BottomNavigation>
  );
};
