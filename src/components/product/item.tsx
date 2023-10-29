import { FinalPrice } from "components/display/final-price";
import React, { FC } from "react";
import { Product } from "types/product";
import { Box, Text } from "zmp-ui";
import { ProductPicker } from "./picker";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { selectedProductIdState } from "pages/product/state";
import { ROUTES } from "pages/route";

export const ProductItem: FC<{ product: Product }> = ({ product }) => {
  const setSelectedProductId = useSetRecoilState(selectedProductIdState);

  const navigate = useNavigate();
  const navigateProductDetail = (productId) => {
    setSelectedProductId(productId);
    navigate(ROUTES.PRODUCT_DETAIL(productId));
  };
  return (
    // <ProductPicker product={product}>
    //   {({ open }) => (
    <div
      className="space-y-2"
      onClick={() => navigateProductDetail(product.id)}
    >
      <Box className="w-full aspect-square relative">
        <img
          loading="lazy"
          src={product.thumbnail}
          className="absolute left-0 right-0 top-0 bottom-0 w-full h-full object-cover object-center rounded-lg bg-skeleton"
        />
      </Box>
      <Text>{product.name}</Text>
      <Text size="xxSmall" className="text-gray pb-2">
        <FinalPrice>{product}</FinalPrice>
      </Text>
    </div>
    // )}
    // </ProductPicker>
  );
};
