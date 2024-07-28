import React, { FC } from "react";
import { useRecoilValueLoadable } from "recoil";
import { newNotificationState } from "state";
import notificationIcon from "static/icons/notification.svg";
import { Box, Text } from "zmp-ui";


export const NotificationIcon: FC<{ active?: boolean }> = ({ active }) => {
  const notification = useRecoilValueLoadable(newNotificationState);
  const quantity = notification.contents.length;

  return (
    <Box className="relative">
      {active ? (
        <img
          src={notificationIcon}
          alt="Cart"
          className={"nav-primary-color"}
        />
      ) : (
        <img src={notificationIcon} alt="Cart" />
      )}
      {quantity > 0 && (
        <Box className="absolute -right-2 -top-[2px] p-[2px] rounded-full bg-red-500 ">
          <Text
            className="size-3 rounded-full text-white flex items-center justify-center"
            size="xxxxSmall"
          >
            {quantity > 9 ? "9+" : quantity}
          </Text>
        </Box>
      )}
    </Box>
  );
};
