import React, { FC } from "react";
import { Link } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { newNotificationState, userState } from "state";
import logo from "static/logo.jpg";
import { getConfig } from "utils/config";
import { Box, Header, Text } from "zmp-ui";
import { ERoles } from "../../constants";
import {NotificationIcon} from "../../components/icon/notification-icon";
import searchIcon from "static/icons/search.svg";

export const Welcome: FC = () => {
  const user = useRecoilValueLoadable(userState);
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Header
        className="app-header no-border pl-4 flex-none pb-[6px]"
        showBackIcon={false}
        title={
          (
            <Box flex alignItems="center" className="space-x-3">
              <Box
                flex
                justifyContent="space-between"
                alignItems="center"
                className="w-3/4"
              >
                <Box flex alignItems="center" className="space-x-3">
                  <img
                    className="w-8 h-8 rounded-full border-inset"
                    src={
                      user.contents?.avatar ||
                      getConfig((c) => c.template.headerLogo) ||
                      logo
                    }
                    alt={"Avatar"}
                  />
                  <Box>
                    {user.state === "hasValue" ? (
                      <>
                        <Box>
                          <Text size="xxsmall" className="text-slate-500">
                            Xin chào,
                          </Text>
                          <Text
                            size="small"
                            className="text-slate-900 font-bold"
                          >
                            {user.contents.name}
                          </Text>
                        </Box>
                        {user.contents.role === ERoles.CTV && (
                          <Text size="xxSmall" className="text-slate-400">
                            Cộng tác viên
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text>...</Text>
                    )}
                  </Box>
                </Box>
                <Box className="flex gap-3">
                  <Link to="/notification">
                    <NotificationIcon />
                  </Link>
                  <Link to="/search">
                    <img src={searchIcon} alt="Search" className={'filter-bg-nature-900'}/>
                  </Link>
                </Box>
              </Box>
            </Box>
          ) as unknown as string
        }
      />
    </React.Suspense>
  );
};
