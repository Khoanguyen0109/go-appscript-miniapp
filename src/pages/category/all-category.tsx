import React, { FC } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoriesState, selectedCategoryIdState } from "state";
import { Box, Header, Page, Text } from "zmp-ui";

const AllCategoriesPage: FC = () => {
  const categories = useRecoilValue(categoriesState);
  const navigate = useNavigate();
  const setSelectedCategoryId = useSetRecoilState(selectedCategoryIdState);
  const gotoCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    navigate("/category");
  };
  return (
    <Page className="flex flex-col">
      <Header title="Tất cả danh mục" />
      <Box className="p-4 grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => gotoCategory(category.id)}
            className="no-underline"
          >
            <Box className="flex flex-col items-center p-4 bg-white rounded-lg">
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 object-contain mb-2"
              />
              <Text className="text-center font-semibold h-16 line-clamp-2">{category.name}</Text>
            </Box>
          </div>
        ))}
      </Box>
    </Page>
  );
};

export default AllCategoriesPage;
