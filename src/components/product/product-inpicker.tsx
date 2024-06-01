import React, { useState } from "react";
import { Box, Button, Icon, Text } from "zmp-ui";
import { Product } from "../../types/product";
import { FinalPrice } from "../display/final-price";
import { SelectedOptions } from "../../types/cart";
import { groupBy } from "lodash";
import { useRecoilValue } from "recoil";
import { globalProductInventoriesSelector } from "../../state";
import ProductVariant from "./component/product-variant";
import { QuantityPicker } from "./quantity-picker";

type Props = {
  product: Product;
  options: SelectedOptions;
  setVisible: () => void;
  setOptions: () => void;
  addToCart: () => void;
  selected: {
    options: SelectedOptions;
    quantity: number;
  };
  isRedirect: boolean;
};

function ProductInPicker({
  product,
  setVisible,
  options,
  setOptions,
  addToCart,
  selected,
  isRedirect,
}: Props) {
  const globalInventories = useRecoilValue(globalProductInventoriesSelector);
  const [quantity, setQuantity] = useState(1);

  const variants = {
    ...(product?.variants ? product?.variants : {}),
    ...groupBy(globalInventories, "group"),
  };
  return (
    <Box className="space-y-6 mt-4 " p={4}>
      <Box className="space-y-2">
        <Box className="flex items-start">
          <img
            loading="lazy"
            src={product.thumbnail}
            className="w-20 h-20 mr-2 rounded-xl"
          />
          <Box>
            <Text.Title className="font-bold">{product.name}</Text.Title>
            <Text className="font-bold mt-1">
              <FinalPrice options={options}>{product}</FinalPrice>
            </Text>
          </Box>
          <Box className="flex-1 text-right pr-2">
            <Icon
              icon="zi-close"
              onClick={() => {
                setVisible(false);
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box className="space-y-5 overflow-y-auto h-[420px]">
        {variants &&
          Object.keys(variants).map((key) => {
            return (
              <ProductVariant
                key={key}
                variant={key}
                value={options[key] as string}
                values={variants[key]}
                onChange={(selectedOption) => {
                  setOptions((prevOptions) => ({
                    ...prevOptions,
                    [key]: selectedOption,
                  }));
                }}
              />
            );
          })}
      </Box>

      {/* {product.variants &&
        product.variants.map((variant) =>
        <ProductVariant variant={variant}/>
          // variant.type === "single" ? (
          //   <SingleOptionPicker
          //     key={variant.key}
          //     variant={variant}
          //     value={options[variant.key] as string}
          //     onChange={(selectedOption) =>
          //       setOptions((prevOptions) => ({
          //         ...prevOptions,
          //         [variant.key]: selectedOption,
          //       }))
          //     }
          //   />
          // ) : (
          //   <MultipleOptionPicker
          //     key={variant.key}
          //     product={product}
          //     variant={variant}
          //     value={options[variant.key] as string[]}
          //     onChange={(selectedOption) =>
          //       setOptions((prevOptions) => ({
          //         ...prevOptions,
          //         [variant.key]: selectedOption,
          //       }))
          //     }
          //   />
          // )
        )} */}
      <QuantityPicker value={quantity} onChange={setQuantity} />
      {selected ? (
        <Button
          variant={quantity > 0 ? "primary" : "secondary"}
          type={quantity > 0 ? "highlight" : "neutral"}
          fullWidth
          onClick={addToCart}
        >
          {quantity > 0
            ? selected
              ? "Cập nhật giỏ hàng"
              : "Thêm vào giỏ hàng"
            : "Xoá"}
        </Button>
      ) : (
        <Button
          disabled={!quantity}
          variant="primary"
          type="highlight"
          fullWidth
          onClick={addToCart}
        >
          {isRedirect ? "Mua ngay" : "Thêm vào giỏ hàng"}
        </Button>
      )}
    </Box>
  );
}

export default ProductInPicker;
