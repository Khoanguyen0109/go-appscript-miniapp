import { FinalPrice } from "components/display/final-price";
import React, { FC } from "react";
import { Product } from "types/product";
import { Box, Text } from "zmp-ui";
import { ProductPicker } from "./picker";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ROUTES } from "pages/route";
import { BsCartPlus } from "react-icons/bs";
import { selectedProductState } from "pages/product/state";
export const ProductItem: FC<{ product: Product }> = ({ product }) => {
  const setSelectedProductId = useSetRecoilState(selectedProductState);

  const navigate = useNavigate();
  const navigateProductDetail = (product: Product) => {
    setSelectedProductId(product);
    navigate(ROUTES.PRODUCT_DETAIL(product.id));
  };
  return (
    <ProductPicker product={product}>
      {({ open }) => (
        <div
          className="space-y-2 shadow-xl rounded-xl"
          onClick={() => navigateProductDetail(product)}
        >
          <Box className="w-full aspect-square relative">
            <img
              loading="lazy"
              src={product.thumbnail}
              className="absolute left-0 right-0 top-0 bottom-0 w-full h-full object-cover object-center rounded-t-xl bg-skeleton"
            />
          </Box>
          <Box className="pt-2 pb-4 px-2">
            <Text className="font-semibold text-sm">{product.name}</Text>
            <Box className=" mt-2 flex items justify-between">
              <Text
                size="xLarge"
                color=""
                className="  text-blue-500 font-bold"
              >
                <FinalPrice>{product}</FinalPrice>
              </Text>
              <BsCartPlus
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              />
            </Box>
          </Box>
        </div>
      )}
    </ProductPicker>
  );
};
