import React, { FC } from "react";
import { ListRenderer } from "components/list-renderer";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  newNotificationState,
  notificationSelectedState,
  notificationsState,
} from "state";
import { Box, Header, Page, Text } from "zmp-ui";
import { Divider } from "components/divider";
import { requestSendNotification } from "zmp-sdk";
import logo from "static/logo.jpg";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "./route";

const NotificationList: FC = () => {
  const newNotification = useRecoilValue(newNotificationState);
  const navigate = useNavigate();
  const [notificationSelected, setNotificationSelected] = useRecoilState(
    notificationSelectedState
  );
  const sendNotification = async () => {
    try {
      await requestSendNotification({});
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const onClick = (item) => {
    setNotificationSelected(item);
    navigate(ROUTES.NOTIFICATION(item.id));
  };
  return (
    <Box className="bg-background">
      <ListRenderer
        noDivider
        items={newNotification}
        renderLeft={(item) => (
          <img className="w-10 h-10 rounded-full" src={item?.image || logo} />
        )}
        renderRight={(item) => (
          <Box key={item.id} onClick={() => onClick(item)}>
            <Text.Header>{item.title}</Text.Header>
            <Text
              size="small"
              className="text-gray overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {item.short_desc}
            </Text>
          </Box>
        )}
      />
    </Box>
  );
};

const NotificationPage: FC = () => {
  return (
    <Page>
      <Header title="Thông báo" showBackIcon={false} />
      <Divider />
      <NotificationList />
    </Page>
  );
};

export default NotificationPage;
