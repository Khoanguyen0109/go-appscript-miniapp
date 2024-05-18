import React from "react";
import { FC } from "react";
import { Box, Input, useNavigate } from "zmp-ui";

export const Inquiry: FC = () => {
  const navigate = useNavigate();
  return (
    <Box className="bg-white px-2 mt-2">
      <Input.Search
        size="small"
        className=""
        onFocus={() => navigate("/search")}
        placeholder="Tìm nhanh đồ uống, món mới ..."
      />
    </Box>
  );
};
