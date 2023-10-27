import React from "react";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { getConfig } from "utils/config";
import { Layout } from "./layout";
import { ConfigProvider } from "./config-provider";
import LoadingScreenOverLay from "./loading-screen";

const MyApp = () => {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<LoadingScreenOverLay />}>
        <ConfigProvider
          cssVariables={{
            "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
            "--zmp-background-color": "#f4f5f6",
          }}
        >
          <App>
            <SnackbarProvider>
              <ZMPRouter>
                <Layout />
              </ZMPRouter>
            </SnackbarProvider>
          </App>
        </ConfigProvider>
      </React.Suspense>
    </RecoilRoot>
  );
};
export default MyApp;
