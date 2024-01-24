import React, { useEffect, useRef } from "react";
import { useSnackbar } from "zmp-ui";

type Props = {};

function useCustomSnackbar() {
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
  const timmerId = useRef();
  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );
  return { openSnackbar, setDownloadProgress, closeSnackbar };
}

export default useCustomSnackbar;
