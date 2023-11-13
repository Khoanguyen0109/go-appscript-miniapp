import { useVirtualKeyboardVisible } from "hooks";
import React, { FC, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { MenuItem } from "types/menu";
import { BottomNavigation, Icon } from "zmp-ui";
import { CartIcon } from "./cart-icon";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import {
  BsFillCartFill,
  BsCart,
  BsFillChatFill,
  BsChatDots,
} from "react-icons/bs";
import { BiUser, BiSolidUser } from "react-icons/bi";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
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
  "/openChat": {
    label: "Chat OA",
    icon: <BsChatDots />,
    activeIcon: <BsFillChatFill />,
  },
  "/profile": {
    label: "Cá nhân",
    icon: <BiUser />,
    activeIcon: <BiSolidUser />,
  },
};

export type TabKeys = keyof typeof tabs;

export const NO_BOTTOM_NAVIGATION_PAGES = ["/search", "/category", "/products"];

export const Navigation: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKeys>("/");
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate();
  const location = useLocation();

  const noBottomNav = useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.some((substring) =>
      location.pathname.includes(substring)
    );
    // return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (noBottomNav || keyboardVisible) {
    return <></>;
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
