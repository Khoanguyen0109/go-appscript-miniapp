import { ProductItem } from "components/product/item";
import React, { FC, Suspense, useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  categoriesState,
  productsByCategoryState,
  selectedCategoryIdState,
} from "state";
import { Box, Header, Page, Tabs, Text } from "zmp-ui";
import NewProductItem from "./index/new-product-item";

const CategoryPicker: FC = () => {
  const categories = useRecoilValue(categoriesState);
  const selectedCategory = useRecoilValue(selectedCategoryIdState);
  const setSelectedCategoryId = useSetRecoilState(selectedCategoryIdState);

  return (
    <Tabs
      scrollable
      activeKey={selectedCategory.toString()}
      defaultActiveKey={`${1}`}
      className="category-tabs"
      onTabClick={(key) => setSelectedCategoryId(key)}
    >
      {categories.map((category) => (
        <Tabs.Tab key={category.id.toString()} label={category.name}>
          <Suspense>
            <CategoryProducts categoryId={category.id} />
          </Suspense>
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

const CategoryProducts: FC<{ categoryId: string }> = ({ categoryId }) => {
  const errorRef = useRef(null);

  const productsByCategory = useRecoilValue(
    productsByCategoryState(categoryId)
  );

  if (productsByCategory.length === 0) {
    return (
      <Box className="flex-1 bg-background p-4 flex justify-center items-center">
        <Text size="xSmall" className="text-gray">
          Không có sản phẩm trong danh mục
        </Text>
      </Box>
    );
  }

  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);
  return (
    <>
      <Box ref={errorRef} className="p-2">
        {productsByCategory.map((product) => (
          <NewProductItem key={product.id} product={product} />
        ))}
      </Box>
    </>
  );
};

const CategoryPage: FC = () => {
  return (
    <Page className="flex flex-col">
      <Header title="Danh mục" />
      <CategoryPicker />
    </Page>
  );
};

export default CategoryPage;
