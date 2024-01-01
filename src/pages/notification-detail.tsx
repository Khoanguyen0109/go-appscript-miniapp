import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { notificationSelectedState } from "state";
import { Box, Button, Header, Page, Text } from "zmp-ui";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";
import logo from "static/logo.jpg";

type Props = {};

function NotificationDetail({}: Props) {
  const [notificationSelected, setNotificationSelected] = useRecoilState(
    notificationSelectedState
  );
  return (
    <Page>
      <Header title={notificationSelected.title} showBackIcon={true} />

      <Box className="h-full bg-blue-200 p-3">
        <Box className="bg-background p-3 rounded-xl">
          <Box className="flex justify-center mb-5" >
            <img
              className="w-10 h-10 rounded-full"
              src={notificationSelected?.image || logo}
            />
          </Box>
          <Box className="flex items-center">
            <Text className="mr-3 font-semibold">Voucher Code: </Text>
            {notificationSelected.code_voucher && (
              <CopyToClipboard
                text={notificationSelected.code_voucher}
                onCopy={() => this.setState({ copied: true })}
              >
                <button className="flex items-center justify-between border-blue-500 border-2 rounded-lg py-2 px-4">
                  <Text className="mr-2 text-blue-500 font-semibold">
                    {" "}
                    {notificationSelected.code_voucher}
                  </Text>{" "}
                  <FaCopy className="text-blue-500" />
                </button>
              </CopyToClipboard>
            )}
          </Box>
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
