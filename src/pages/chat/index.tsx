import { OA_ID } from "enviroment";
import React, { useEffect } from "react";
import { openChat } from "zmp-sdk";
import { Button } from "zmp-ui";
import logo from "static/logo.jpg";

type Props = {};

function OpenChat({}: Props) {
  const openChatScreen = () => {
    openChat({
      type: "oa",
      id: OA_ID,
      message: "Xin Chào",
      success: () => {},
      fail: (err) => {
        console.log("err", err);
      },
    });
  };

  useEffect(() => {
    openChatScreen();
  }, []);
  return (
    <div className=" w-screen h-screen flex justify-center flex-col items-center">
      <img src={logo} className="w-12 h-12 rounded-lg border-inset" />
      <Button onClick={() => openChatScreen()} className="mt-4">
        Chat với Mion OA
      </Button>
    </div>
  );
}

export default OpenChat;
