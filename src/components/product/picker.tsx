import { FinalPrice } from "components/display/final-price";
import { Sheet } from "components/fullscreen-sheet";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSetRecoilState } from "recoil";
import { cartState } from "state";
import { SelectedOptions } from "types/cart";
import { Product } from "types/product";
import { findVariant, isIdentical } from "utils/product";
import { Box, Button, Icon, Text } from "zmp-ui";
import { MultipleOptionPicker } from "./multiple-option-picker";
import { QuantityPicker } from "./quantity-picker";
import { SingleOptionPicker } from "./single-option-picker";
import ProductVariant from "./component/product-variant";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "pages/route";

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

function getDefaultOptions(product?: Product) {
  if (product && product.variants) {
    return product.variants.reduce(
      (options, variant) =>
        Object.assign(options, {
          [variant.key]: variant.default,
        }),
      {}
    );
  }
  return {};
}

export const ProductPicker: FC<ProductPickerProps> = ({
  children,
  product,
  selected,
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<SelectedOptions>({});
  const [quantity, setQuantity] = useState(1);
  const setCart = useSetRecoilState(cartState);
  const [isRedirect, setIsRedirect] = useState(false);
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
              isIdentical(item.options, selected.options)
          )!;
          if (quantity === 0) {
            res.splice(cart.indexOf(editing), 1);
          } else {
            const existed = cart.find(
              (item, i) =>
                i !== cart.indexOf(editing) &&
                item.product.id === product.id &&
                isIdentical(item.options, options)
            )!;
            const exitedInventories = findVariant(editing.product, options);
            res.splice(cart.indexOf(editing), 1, {
              ...editing,
              options,
              inventory_id: exitedInventories?.id,
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
              isIdentical(item.options, options)
          );
          const exitedInventories = findVariant(product, options);
          if (existed) {
            res.splice(cart.indexOf(existed), 1, {
              ...existed,
              inventory_id: exitedInventories?.id,
              quantity: existed.quantity + quantity,
            });
          } else {
            res = res.concat({
              selected: true,
              product,
              options,
              inventory_id: exitedInventories?.id,
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
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          {product && (
            <Box className="space-y-6 mt-2" p={4}>
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
              <Box className="space-y-5">
                {product.variants &&
                  Object.keys(product.variants).map((key) => (
                    <ProductVariant
                      variant={key}
                      value={options[key] as string}
                      values={product.variants[key]}
                      onChange={(selectedOption) => {
                        setOptions((prevOptions) => ({
                          ...prevOptions,
                          [key]: selectedOption,
                        }));
                      }}
                    />
                  ))}
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
            </Box>
          )}
        </Sheet>,
        document.body
      )}
    </>
  );
};
