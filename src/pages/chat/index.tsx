import Loading from "components/loading";
import LoadingScreenOverLay from "components/loading-screen";
import { OA_ID } from "enviroment";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import { openChat } from "zmp-sdk";

type Props = {};

function OpenChat({}: Props) {
  const user = useRecoilValue(userState);

  const openChatScreen = () => {
    openChat({
      type: "oa",
      id: OA_ID,
      message: "Xin Chào",
      success: () => {},
      fail: (err) => {
        console.log('err', err)
      },
    });
  };
  useEffect(() => {
    openChatScreen();
  }, []);
  return <LoadingScreenOverLay />;
}

export default OpenChat;
