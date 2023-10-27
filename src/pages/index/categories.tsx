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
  const setCategories = useSetRecoilState(categoriesState);

  const gotoCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    navigate("/category");
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      console.log('res', res)
      setCategories(res.data.data)
    } catch (error) {}
  };

  useEffect(()=>{
    fetchCategories()
  },[])

  return (
    <Box className="bg-white grid grid-cols-4 gap-4 p-4">
      {categories.map((category, i) => (
        <div
          key={i}
          onClick={() => gotoCategory(category.id)}
          className="flex flex-col space-y-2 items-center"
        >
          <img className="w-12 h-12" src={category.image} />
          <Text size="xxSmall" className="text-gray">
            {category.name}
          </Text>
        </div>
      ))}
    </Box>
  );
};
