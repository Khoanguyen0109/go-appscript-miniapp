import { ProductItem } from "components/product/item";
import React, { FC, Suspense, useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRecoilValue } from "recoil";
import {
  categoriesState,
  productsByCategoryState,
  selectedCategoryIdState,
} from "state";
import { Box, Header, Page, Tabs, Text } from "zmp-ui";

const CategoryPicker: FC = () => {
  const categories = useRecoilValue(categoriesState);
  const selectedCategory = useRecoilValue(selectedCategoryIdState);
  return (
    <Tabs
      scrollable
      defaultActiveKey={selectedCategory}
      className="category-tabs"
    >
      {categories.map((category) => (
        <Tabs.Tab key={category.id} label={category.name}>
          <Suspense>
            <CategoryProducts categoryId={category.id} />
          </Suspense>
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

const CategoryProducts: FC<{ categoryId: string }> = ({ categoryId }) => {
  const itemsPerPage = 10;
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
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = productsByCategory.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(productsByCategory.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % productsByCategory.length;

    setItemOffset(newOffset);
    errorRef.current.scrollIntoView();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentItems]);
  return (
    <Box ref={errorRef} className="bg-background grid grid-cols-2 gap-4 p-4">
      {currentItems.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
      <Box>
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </Box>
    </Box>
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
