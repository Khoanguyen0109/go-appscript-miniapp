import React, { FC, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { productsState } from "state";
import { Box, Header, Page, Text } from "zmp-ui";
import NewProductItem from "../index/new-product-item";

const AllProducts: FC = () => {
  const errorRef = useRef(null);
  const products = useRecoilValue(productsState);

  if (products.length === 0) {
    return (
      <Box className="flex-1 bg-background p-4 flex justify-center items-center">
        <Text size="xSmall" className="text-gray">
          Không có sản phẩm
        </Text>
      </Box>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box ref={errorRef} className="p-2 grid grid-cols-2 gap-2">
      {products.map((product) => (
        <NewProductItem key={product.id} product={product} />
      ))}
    </Box>
  );
};

const AllProductPage: FC = () => {
  return (
    <Page className="flex flex-col">
      <Header title="Tất cả sản phẩm" />
      <AllProducts />
    </Page>
  );
};

export default AllProductPage;
