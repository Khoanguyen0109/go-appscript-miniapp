import React, { FC } from "react";
import { useSetRecoilState } from "recoil";
import { selectedProductState } from "../product/state";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/product";
import { ROUTES } from "../route";
import { ProductPicker } from "../../components/product/picker";
import { Box, Text } from "zmp-ui";
import { FinalPrice } from "../../components/display/final-price";
import { BiPlus } from "react-icons/bi";

type Props = {};

export const NewProductItem: FC<{ product: Product }> = ({ product }) => {
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
          className="flex shadow-md rounded-md mb-3"
          onClick={() => navigateProductDetail(product)}
        >
          <Box className="w-24 h-24 mr-2 ">
            <img
              loading="lazy"
              className="object-cover object-center"
              src={product.thumbnail}
            />
          </Box>
          <Box className="flex-1 flex flex-col justify-between">
            <Box className="w-full">
              <Text className="font-semibold text-sm">{product.name}</Text>

              <Text
                size="normal"
                color=""
                className="mt-1 w-56 text-xs truncate "
              >
                {product.descThumbnail}
              </Text>
            </Box>
            <Box className="flex w-full mb-2 justify-between">
              <Text
                size="xLarge"
                color=""
                className="  text-blue-500 font-bold"
              >
                <FinalPrice>{product}</FinalPrice>
              </Text>

              <BiPlus
                className="bg-red-500 rounded-xl"
                color="white"
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

export default NewProductItem;
