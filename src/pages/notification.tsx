import React, { FC } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { newNotificationState, notificationSelectedState } from "state";
import { Box, Header, Page, Text } from "zmp-ui";
import { Divider } from "components/divider";
import { requestSendNotification } from "zmp-sdk";
import logo from "static/logo.jpg";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "./route";
import { formatDate } from "../utils/date";

const NotificationList: FC = () => {
  const newNotification = useRecoilValue(newNotificationState);
  const navigate = useNavigate();
  const [notificationSelected, setNotificationSelected] = useRecoilState(
    notificationSelectedState
  );

  const onClick = (item) => {
    setNotificationSelected(item);
    navigate(ROUTES.NOTIFICATION(item.id));
  };
  return (
    <Box className=" p-2">
      {newNotification.map((item) => {
        return (
          <Box
            onClick={() => onClick(item)}
            className="flex bg-background mb-2 px-2 py-4 rounded-lg"
          >
            <img
              className="w-12 h-12 rounded-full mr-3"
              src={item?.thumbnail || logo}
            />
            <Box>
              <Text.Header className="font-bold">{item.title}</Text.Header>
              <Text
                size="small"
                className=" overflow-hidden  text-ellipsis mb-2"
              >
                {item.desc}
              </Text>
              <Text
                size="xSmall"
                className="text-gray overflow-hidden whitespace-nowrap text-ellipsis"
              >
                {formatDate(item.createdAt)}
              </Text>
            </Box>
          </Box>
        );
      })}
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
