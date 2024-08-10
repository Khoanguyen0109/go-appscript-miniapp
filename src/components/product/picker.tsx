import { Sheet } from "components/fullscreen-sheet";
import { groupBy, includes, isEmpty } from "lodash";
import { ROUTES } from "pages/route";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { cartState, globalProductInventoriesSelector } from "state";
import { SelectedOptions } from "types/cart";
import { Product } from "types/product";
import { isIdenticalV2 } from "utils/product";
import { Box, Button, Icon, Text } from "zmp-ui";
import { FinalPrice } from "../display/final-price";
import { DisplaySelectedOptions } from "../display/selected-options";
import ProductVariant from "./component/product-variant";
import { QuantityPicker } from "./quantity-picker";

export interface ProductPickerProps {
  product?: Product;
  selected?: {
    options: SelectedOptions;
    quantity: number;
  };
  children: (methods: {
    open: () => void;
    close: () => void;
    openRedirect: () => void;
  }) => ReactNode;
}

export const ProductPicker: FC<ProductPickerProps> = ({
  children,
  product,
  selected,
}) => {
  const globalInventories = useRecoilValue(globalProductInventoriesSelector);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<SelectedOptions>({});
  const [quantity, setQuantity] = useState(1);
  const setCart = useSetRecoilState(cartState);
  const [isRedirect, setIsRedirect] = useState(false);
  const variants = useMemo(
    () =>
      visible
        ? {
            ...(product?.variants ? product?.variants : {}),
            ...groupBy(globalInventories, "group"),
          }
        : {},
    [visible]
  );
  const sortVariant = useMemo(() => {
    if (!product || !product.variants) return {};

    const newVariants = { ...product.variants };
    Object.keys(variants).forEach((key) => {
      if (newVariants.hasOwnProperty(key)) {
        newVariants[key] = variants[key];
      }
    });

    return newVariants;
  }, [variants, product]);

  useEffect(() => {
    if (selected) {
      setOptions(selected.options);
      setQuantity(selected.quantity);
    }
  }, [selected]);

  const addToCart = () => {
    if (product) {
      setCart((cart) => {
        let res = [...cart];
        if (selected) {
          // updating an existing cart item, including quantity and size, or remove it if new quantity is 0
          const editing = cart.find(
            (item) =>
              item.product.id === product.id &&
              isIdenticalV2(item.options, selected.options)
          )!;
          if (quantity === 0) {
            res.splice(cart.indexOf(editing), 1);
          } else {
            const existed = cart.find(
              (item, i) =>
                i !== cart.indexOf(editing) &&
                item.product.id === product.id &&
                isIdenticalV2(item.options, options)
            )!;
            res.splice(cart.indexOf(editing), 1, {
              ...editing,
              options,
              quantity: existed ? existed.quantity + quantity : quantity,
            });
            if (existed) {
              res.splice(cart.indexOf(existed), 1);
            }
          }
        } else {
          // adding new item to cart, or merging if it already existed before
          const existed = cart.find(
            (item) =>
              item.product.id === product.id &&
              isIdenticalV2(item.options, options)
          );
          if (existed) {
            res.splice(cart.indexOf(existed), 1, {
              ...existed,
              quantity: existed.quantity + quantity,
            });
          } else {
            res = res.concat({
              selected: true,
              product,
              options,
              price: product.price,
              quantity,
            });
          }
        }
        return res;
      });
    }
    setVisible(false);
    setQuantity(1);
    setOptions({});
    if (isRedirect) {
      navigate(ROUTES.CART);
    }
  };
  return (
    <>
      {children({
        openRedirect: () => {
          setVisible(true);
          setIsRedirect(true);
        },
        open: () => setVisible(true),
        close: () => {
          setVisible(false);
          setIsRedirect(false);
        },
      })}
      {createPortal(
        <Sheet
          visible={visible}
          onClose={() => setVisible(false)}
          autoHeight
          style={{
            marginTop: 16,
          }}
        >
          {product && (
            <Box className="space-y-6 mt-4 " p={4}>
              <Box className="space-y-2">
                <Box className="flex items-start">
                  <img
                    loading="lazy"
                    src={product.thumbnail}
                    className="w-20 h-20 mr-2 rounded-xl"
                  />
                  <Box>
                    <Text.Title className="font-bold">
                      {product.name}
                    </Text.Title>
                    <Text className="font-bold mt-1">
                      <FinalPrice options={options}>{product}</FinalPrice>
                    </Text>
                    <Text className="text-xs ">
                      <DisplaySelectedOptions options={options}>
                        {product}
                      </DisplaySelectedOptions>
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
              <Box className="space-y-5 overflow-y-auto max-h-[40dvh]">
                {!isEmpty(variants) &&
                  Object.keys(sortVariant).map((key) => {
                    return (
                      <ProductVariant
                        variant={key}
                        value={options[key] as string[]}
                        key={key}
                        values={variants[key]}
                        onChange={(selectedOption) => {
                          if (key === "Phân loại") {
                            setOptions((prevOptions) => ({
                              ...prevOptions,
                              [key]: includes(prevOptions[key], selectedOption)
                                ? prevOptions[key].filter(
                                    (item) => item.id !== selectedOption.id
                                  )
                                : [...(prevOptions[key] ?? []), selectedOption],
                            }));
                          } else {
                            setOptions((prevOptions) => ({
                              ...prevOptions,
                              [key]: [selectedOption],
                            }));
                          }
                        }}
                      />
                    );
                  })}
                <Text className={"font-semibold mb-4"}>Mô tả sản phẩm</Text>
                {product.desc}
              </Box>

              <Text className={"font-semibold mb-4"}>
                Số lượng: {product.unit}
              </Text>
              <QuantityPicker value={quantity} onChange={setQuantity} noTitle />
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
          )}
        </Sheet>,
        document.body
      )}
    </>
  );
};
