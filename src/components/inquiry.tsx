import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, Input, Box } from "zmp-ui";
import FilterIcon from "../assets/sliders.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../pages/route";

function Inquiry(props) {
  const navigate = useNavigate();
  return (
    <>
      <Box className="flex items-center justify-center">
        <Input.Search
          onClick={() => navigate(ROUTES.SEARCH)}
          // value={keyword}
          // onChange={(e) => setKeyword(e.target.value)}
          className="inquiry h-[46px] mr-4 my-4 border-none bg-white"
          placeholder="Tìm kiếm"
        />
        {/* <Box className="bg-white w-[46px] h-[46px] p-4 flex items-center justify-center rounded-sm cursor-pointer">
          <img
            src={FilterIcon}
            alt={""}
            onClick={() => navigate(ROUTES.SEARCH)}
          />
        </Box> */}
      </Box>
    </>
  );
}

export default Inquiry;
