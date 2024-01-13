import React, { FC } from "react";
import { Box, Header, Text } from "zmp-ui";
import { useRecoilValueLoadable } from "recoil";
import { userState } from "state";
import logo from "static/logo.jpg";
import appConfig from "../../../app-config.json";
import { getConfig } from "utils/config";

export const Welcome: FC = () => {
  const user = useRecoilValueLoadable(userState);
  console.log("user", user);
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Header
        className="app-header no-border pl-4 flex-none pb-[6px]"
        showBackIcon={false}
        title={
          (
            <Box flex alignItems="center" className="space-x-3">
              <img
                className="w-8 h-8 rounded-full border-inset"
                src={getConfig((c) => c.template.headerLogo) || logo}
              />
              <Box>
                {/* <Text.Title size="small">{appConfig.app.title}</Text.Title> */}
                {user.state === "hasValue" ? (
                  <>
                    <Text size="small" className="text-slate-700">
                      {user.contents.name}
                    </Text>
                    <Text size="xxSmall" className="text-slate-400">
                      Thành viên {user.contents?.memberClass || "Mới"}
                    </Text>
                  </>
                ) : (
                  <Text>...</Text>
                )}
              </Box>
            </Box>
          ) as unknown as string
        }
      />
    </React.Suspense>
  );
};
