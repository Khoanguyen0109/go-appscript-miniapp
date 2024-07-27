import { groupBy } from "lodash";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Text } from "zmp-ui";
import { FinalPrice } from "../../components/display/final-price";
import { ProductPicker } from "../../components/product/picker";
import { QuantityPicker } from "../../components/product/quantity-picker";
import { returnState } from "../../state";
import { Product } from "../../types/product";
import { selectedProductState } from "../product/state";
import { ROUTES } from "../route";

export const ReturnItem: FC<{ product: Product }> = ({ product }) => {
  const setSelectedProductId = useSetRecoilState(selectedProductState);
  const prevReturn = useRecoilValue(returnState);
  const setReturn = useSetRecoilState(returnState);
  const navigate = useNavigate();
  const navigateProductDetail = (product: Product) => {
    setSelectedProductId(product);
    navigate(ROUTES.PRODUCT_DETAIL(product.id));
  };
  const [quantity, setQuantity] = useState(0);

  const updateReturn = useCallback(
    (newData) => {
      setReturn(newData);
    },
    [setReturn]
  );

  useEffect(() => {
    const mapProduct = (item: Product) => {
      return {
        ...item,
        costdown: item.discount
          ? Number(item.price) -
            (Number(item.price) * Number(item.discount)) / 100
          : Number(item.price),
        variants: groupBy([...item.inventories], "group"),
      };
    };

    const data = {
      quantity: quantity,
      selected: true,
      options: {},
      product: mapProduct(product),
    };

    updateReturn((prevState) => {
      const index = prevState.findIndex(
        (item) => item.product.id === product.id
      );
      if (index !== -1) {
        return prevState.map((item, i) => (i === index ? data : item));
      } else {
        return [...prevState, data];
      }
    });
  }, [product, quantity, updateReturn]);

  return (
    <ProductPicker product={product}>
      {({ open }) => (
        <div
          className="flex overflow-hidden"
          // onClick={() => navigateProductDetail(product)}
        >
          <img
            loading="lazy"
            className="size-28 object-cover object-center p-1 rounded-2xl"
            src={product.thumbnail}
            alt={product.name}
            referrerPolicy="no-referrer"
          />
          <div className="p-2 border-[#E2E8F0] w-full">
            {/*<Box className="flex-1">*/}
            <Text className="font-semibold text-base h-14 line-clamp-2">
              {product.name}
            </Text>
            <Box className={"flex items-center w-full"}>
              <Box className={"w-1/2"}>
                <Text className="text-nature-500 font-semibold text-lg">
                  <FinalPrice>{product}</FinalPrice>
                </Text>
              </Box>
              <Box className={"w-1/2"}>
                <QuantityPicker
                  noTitle
                  value={quantity}
                  onChange={setQuantity}
                />
              </Box>
            </Box>
          </div>
        </div>
      )}
    </ProductPicker>
  );
};

export default ReturnItem;
