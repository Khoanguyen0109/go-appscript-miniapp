import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { notificationSelectedState } from "state";
import { Box, Button, Header, Page, Text } from "zmp-ui";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";

type Props = {};

function NotificationDetail({}: Props) {
  const [notificationSelected, setNotificationSelected] = useRecoilState(
    notificationSelectedState
  );
  return (
    <Page>
      <Header title={notificationSelected.title} showBackIcon={true} />

      <Box className="h-full p-3">
        <Box className="p-3 rounded-xl">
          {notificationSelected.content && (
            <Text className="mt-3 ">
              {notificationSelected.content.indexOf("</") !== -1 ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: notificationSelected.content.replace(
                      /(<? *script)/gi,
                      "illegalscript"
                    ),
                  }}
                ></div>
              ) : (
                notificationSelected.content
              )}
            </Text>
          )}
        </Box>
      </Box>
    </Page>
  );
}

export default NotificationDetail;
