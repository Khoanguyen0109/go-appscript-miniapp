import React from "react";
import ReactLoading from "react-loading";
import logo from "static/logo.jpg";

type Props = {};

function LoadingScreenOverLay({}: Props) {
  return (
    <div style={{ position: "fixed", top: "40%", left: "45%" }}>
      <img src={logo} className="w-12 h-12 rounded-lg border-inset" />

      <ReactLoading type="bubbles" color={"fff"} />
    </div>
  );
}

export default LoadingScreenOverLay;
