import React, { useEffect } from "react";
import { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoriesState, selectedCategoryIdState } from "state";
import { useNavigate } from "react-router";
import { axiosInstance } from "api/instance";

export const Categories: FC = () => {
  const categories = useRecoilValue(categoriesState);
  const navigate = useNavigate();
  const setSelectedCategoryId = useSetRecoilState(selectedCategoryIdState);

  const gotoCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    navigate("/category");
  };

  return (
    <Box className="py-2 px-4 max-w-full overflow-x-auto">
      <Text className="font-bold text-lg">Tất cả mặt hàng</Text>
      <Box className="bg-white  w-full mt-4 flex overflow-x-auto">
        {categories.map((category, i) => (
          <div
            key={i}
            onClick={() => gotoCategory(category.id)}
            style={{ minWidth: "100px" }}
            className="flex flex-col space-y-2 items-center mr-2  "
          >
            <img
              className="w-12 max-w-none h-12 rounded-full shadow-lg object-contain"
              src={category.image}
            />
            <Text
              size="xxSmall"
              className=" text-center font-semibold text-slate-950"
            >
              {category.name}
            </Text>
          </div>
        ))}
      </Box>
    </Box>
  );
};
