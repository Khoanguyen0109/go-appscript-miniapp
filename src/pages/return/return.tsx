import React, { FC, Suspense, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  categoriesReturnState,
  productsByCategoryReturnState,
  returnState,
  selectedCategoryIdReturnState,
} from "state";
import { Box, Button, Header, Page, Tabs, Text } from "zmp-ui";
import ReturnItem from "./return-item";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../route";

const CategoryPicker: FC = () => {
  const categories = useRecoilValue(categoriesReturnState);
  const selectedCategory = useRecoilValue(selectedCategoryIdReturnState);
  const setSelectedCategoryId = useSetRecoilState(
    selectedCategoryIdReturnState
  );
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
    productsByCategoryReturnState(categoryId)
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
  return (
    <>
      <Box
        ref={errorRef}
        className="p-2 flex flex-col gap-2 divide-y divide-[#D7DAE0] bg-white m-1 rounded-lg"
      >
        {productsByCategory.map((product) => (
          <ReturnItem key={product.id} product={product} />
        ))}
      </Box>
    </>
  );
};

const CategoryPage: FC = () => {
  const returnItems = useRecoilValue(returnState);
  const navigate = useNavigate();
  const itemsWithQuantity = returnItems.filter((item) => item.quantity > 0);
  const isReturnItemsEmpty = itemsWithQuantity.length === 0;
  const createReturn = async () => {
    if (itemsWithQuantity.length > 0) {
      // console.log("Processing return for items:", itemsWithQuantity);
      navigate(ROUTES.RETURN_REVIEW)
    } else {
      // console.log("No items with quantity selected for return");
    }
  };
  return (
    <Page className="flex flex-col">
      <Header className="text-center" title="Hoàn đơn" />
      <CategoryPicker />
      <Box className="sticky bottom-0 bg-background p-2">
        <Button
          type="highlight"
          disabled={isReturnItemsEmpty}
          fullWidth
          size={"medium"}
          className={"rounded-lg"}
          onClick={() => createReturn()}
        >
          Tạo đơn hoàn
        </Button>
      </Box>
    </Page>
  );
};

export default CategoryPage;
