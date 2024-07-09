import React from "react";
import { Input, Box } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../pages/route";

function Inquiry(props) {
  const navigate = useNavigate();
  return (
    <>
      <Box className="flex items-center justify-center">
        <Input.Search
          onClick={() => navigate(ROUTES.SEARCH)}
          className="inquiry h-[46px] mr-4 my-4 border-none bg-white"
          placeholder="Tìm kiếm"
        />
      </Box>
    </>
  );
}

export default Inquiry;
