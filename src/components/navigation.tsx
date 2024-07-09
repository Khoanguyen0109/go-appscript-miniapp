import { useVirtualKeyboardVisible } from "hooks";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { MenuItem } from "types/menu";
import { BottomNavigation } from "zmp-ui";
import { CartIcon } from "./cart-icon";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { BsFillCartFill, BsFillSearchHeartFill } from "react-icons/bs";
import { BiUser, BiSolidUser, BiSearch } from "react-icons/bi";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import { ROUTES } from "pages/route";
import { useRecoilValue } from "recoil";
import { userState } from "../state";
import { ERoles } from "../constants";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoChatbubbles } from "react-icons/io5";

const tabs: Record<string, MenuItem> = {
  "/cart": {
    label: "Giỏ hàng",
    icon: <CartIcon />,
    activeIcon: <BsFillCartFill />,
  },
  "/notification": {
    label: "Thông báo",
    icon: <IoMdNotificationsOutline />,
    activeIcon: <IoMdNotifications />,
  },

  "/": {
    label: "Trang chủ",
    icon: <AiOutlineHome />,
    activeIcon: <AiFillHome />,
  },
  "/search": {
    label: "Tìm kiếm",
    icon: <BiSearch />,
    activeIcon: <BsFillSearchHeartFill />,
  },
  "/openChat": {
    label: "Chat OA",
    icon: <IoChatbubblesOutline />,
    activeIcon: <IoChatbubbles />,
  },
  "/profile": {
    label: "Cá nhân",
    icon: <BiUser />,
    activeIcon: <BiSolidUser />,
  },
};

export type TabKeys = keyof typeof tabs;

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
          icon={<CartIcon />}
          activeIcon={<BsFillCartFill />}
          onClick={() => navigate(ROUTES.SHIPPING)}
        />
        <BottomNavigation.Item
          key={"/profile"}
          label={"Tài khoản"}
          icon={<BiUser />}
          activeIcon={<BiSolidUser />}
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
