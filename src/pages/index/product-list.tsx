import React, { FC, Suspense, useRef, useState } from "react";
import { Section } from "components/section";
import { useRecoilValue } from "recoil";
import { productsState } from "state";
import { Box } from "zmp-ui";
import { ProductItemSkeleton } from "components/skeletons";
import NewProductItem from "./new-product-item";

export const ProductListContent: FC = () => {
  const errorRef = useRef(null);

  const products = useRecoilValue(productsState);

  if (products.length <= 0) {
    return <></>;
  }
  return (
    <Section title="Danh sách sản phẩm" mt={1}>
      <Box ref={errorRef} className="">
        {products.map((product) => (
          <NewProductItem key={product.id} product={product} />
        ))}
      </Box>
    </Section>
  );
};

export const ProductListFallback: FC = () => {
  const products = [...new Array(12)];

  return (
    <Section title="Danh sách sản phẩm">
      <Box className="grid grid-cols-2 gap-4">
        {products.map((_, i) => (
          <ProductItemSkeleton key={i} />
        ))}
      </Box>
    </Section>
  );
};

export const ProductList: FC = () => {
  return (
    <Suspense fallback={<ProductListFallback />}>
      <ProductListContent />
    </Suspense>
  );
};
