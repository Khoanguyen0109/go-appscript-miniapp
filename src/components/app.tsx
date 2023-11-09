import React, { useEffect, useState } from "react";
import { App, ZMPRouter, SnackbarProvider, Modal } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { getConfig } from "utils/config";
import { Layout } from "./layout";
import { ConfigProvider } from "./config-provider";
import LoadingScreenOverLay from "./loading-screen";
import { closeApp, offConfirmToExit, onConfirmToExit } from "zmp-sdk";

const MyApp = () => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    onConfirmToExit(() => setConfirmModalVisible(true));
    return () => offConfirmToExit();
  }, []);

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
            <Modal
              visible={confirmModalVisible}
              title="Thoát ứng dụng"
              description="Bạn có muốn thoát ứng dụng"
              actions={[
                {
                  text: "Ở lại ứng dụng",
                  onClick: () => {
                    setConfirmModalVisible(false);
                  },
                  highLight: true,
                },
                {
                  text: "Có",
                  onClick: () => {
                    closeApp();
                  },
                },
              ]}
            />
          </App>
        </ConfigProvider>
      </React.Suspense>
    </RecoilRoot>
  );
};
export default MyApp;
