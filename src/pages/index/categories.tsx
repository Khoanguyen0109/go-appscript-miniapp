import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoriesState, selectedCategoryIdState } from "state";
import { Box, Text } from "zmp-ui";

export const Categories: FC = () => {
  const categories = useRecoilValue(categoriesState);
  const navigate = useNavigate();
  const setSelectedCategoryId = useSetRecoilState(selectedCategoryIdState);

  const gotoCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    navigate("/category");
  };

  return (
    <Box className="mt-2 px-2 max-w-full overflow-x-auto">
      <Box className={"flex justify-between items-center"}>
        <Text className="font-bold text-lg">Danh mục</Text>
        <Link to={"/all-category"} className="font-medium text-md text-[#212529] no-underline">
          Xem tất cả
        </Link>
      </Box>
      <Box className="bg-white w-full mt-4 flex overflow-x-auto">
        {categories.map((category, i) => (
          <div
            key={i}
            onClick={() => gotoCategory(category.id)}
            style={{ minWidth: "100px" }}
            className="flex flex-col space-y-2 items-center mr-2  "
          >
            <img
              className="w-12 max-w-none h-12 rounded-full object-contain bg-[#F3F5F7]"
              src={category.image}
              alt={category.name}
              referrerPolicy="no-referrer"
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
