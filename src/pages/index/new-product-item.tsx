import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Text } from "zmp-ui";
import { FinalPrice } from "../../components/display/final-price";
import { ProductPicker } from "../../components/product/picker";
import { Product } from "../../types/product";
import { selectedProductState } from "../product/state";
import { ROUTES } from "../route";

export const NewProductItem: FC<{ product: Product }> = ({ product }) => {
  const setSelectedProductId = useSetRecoilState(selectedProductState);
  const navigate = useNavigate();
  const navigateProductDetail = (product: Product) => {
    setSelectedProductId(product);
    navigate(ROUTES.PRODUCT_DETAIL(product.id));
  };
  return (
    <ProductPicker product={product} key={product.id}>
      {({ open }) => (
        <div
          className="flex flex-col shadow-md rounded-md mb-3 overflow-hidden"
          onClick={() => navigateProductDetail(product)}
        >
          <img
            loading="lazy"
            className="w-full h-40 object-cover object-center"
            src={product.thumbnail}
            alt={product.name}
            referrerPolicy="no-referrer"
          />
          <div className="p-2 border-[#E2E8F0]">
            <Text className="font-semibold text-base h-14 line-clamp-2">
              {product.name}
            </Text>
            <Text className="text-nature-500 font-semibold text-lg">
              <FinalPrice>{product}</FinalPrice>
            </Text>
            <button
              className="w-full bg-nature-800 text-white rounded-md py-2 mt-2"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      )}
    </ProductPicker>
  );
};

export default NewProductItem;
