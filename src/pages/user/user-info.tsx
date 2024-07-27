import React from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import logo from "static/logo.jpg";
import { Box, Icon, Text } from "zmp-ui";
import { EScoreRank } from "../../constantsapp";
import { userState } from "../../state";
import badgeIcon from "../../static/icons/badge.svg";
import editIcon from "../../static/icons/edit.svg";
import phoneIcon from "../../static/icons/phone.svg";
import { getConfig } from "../../utils/config";

const UserInfoBlock = () => {
  const user = useRecoilValue(userState);
  const userLoadable = useRecoilValueLoadable(userState);

  return (
    <Box className="p-4 mb-24">
      <Box className="flex items-center mb-2 justify-between">
        <Box className={"flex items-center"}>
          <img
            className="size-16 rounded-full mr-4"
            src={
              userLoadable.contents?.avatar ||
              getConfig((c) => c.template.headerLogo) ||
              logo
            }
            alt="User Avatar"
          />
          <Box className={"flex flex-col gap-1"}>
            <Box className={"bg-badge rounded-lg px-2 flex gap-1 items-center"}>
              <img src={badgeIcon} alt="Badge" className="size-3.5" />
              <Text size={"xxSmall"} className="text-white">
                {user?.memberClass || EScoreRank.NEW}
              </Text>
            </Box>
            <Text.Title className="font-bold text-white">
              {user.name}
            </Text.Title>
          </Box>
        </Box>
      </Box>
      {/*<Box className="flex justify-between">*/}
      {/*  <Box className="flex items-center gap-2">*/}
      {/*    <img src={phoneIcon} alt={"Phone Number"} />*/}
      {/*    <Text.Title className="font-bold text-white">*/}
      {/*      {user.phone || "N/A"}*/}
      {/*    </Text.Title>*/}
      {/*  </Box>*/}
      {/*</Box>*/}
    </Box>
  );
};
export default UserInfoBlock;
