import React from "react";
import ReactLoading from "react-loading";

type Props = {};

function LoadingScreenOverLay({}: Props) {
  return (
    <div style={{ position: "fixed", top: "50%", left: "50%" }}>
      <ReactLoading type="bubbles" color={"fff"} />
    </div>
  );
}

export default LoadingScreenOverLay;
