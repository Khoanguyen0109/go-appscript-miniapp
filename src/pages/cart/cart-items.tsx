import { FinalPrice } from "components/display/final-price";
import { DisplayPrice } from "components/display/price";
import { DisplaySelectedOptions } from "components/display/selected-options";
import { ListRenderer } from "components/list-renderer";
import { ProductPicker } from "components/product/picker";
import { QuantityPicker } from "components/product/quantity-picker";
import { isString } from "lodash";
import React, { FC, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { cartState } from "state";
import { Cart, CartItem } from "types/cart";
import { isIdentical } from "utils/product";
import { Box, Checkbox, Icon, Text } from "zmp-ui";

type TCartItemProps = {
  cart: Cart;
  disableClick?: boolean;
};
export const CartItems: FC<TCartItemProps> = ({
  cart,
  disableClick = true,
}) => {
  const [editingItem, setEditingItem] = useState<CartItem | undefined>();
  const setCart = useSetRecoilState(cartState);

  const onChangeQuantity = (productItem, quantity) => {
    const product = productItem.product;
    const options = productItem.options;
    setCart((cart) => {
      const res = [...cart];
      const editing = cart.find(
        (item) =>
          item.product.id === productItem.product.id &&
          isIdentical(item.options, productItem.options)
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
        res.splice(cart.indexOf(editing), 1, {
          ...editing,
          options,
          quantity: existed ? existed.quantity + quantity : quantity,
        });
        if (existed) {
          res.splice(cart.indexOf(existed), 1);
        }
      }
      return res;
    });
  };

  const onCheckProduct = (productItem) => {
    setCart((cart) => {
      const res = [...cart];
      const editing = cart.find(
        (item) =>
          item.product.id === productItem.product.id &&
          isIdentical(item.options, productItem.options)
      )!;
      res.splice(cart.indexOf(editing), 1, {
        ...editing,
        selected: !editing.selected,
      });
      return res;
    });
  };

  const onRemoveProduct = (productItem) => {
    setCart((cart) => {
      const res = [...cart];
      const editing = cart.find(
        (item) =>
          item.product.id === productItem.product.id &&
          isIdentical(item.options, productItem.options)
      )!;
      res.splice(cart.indexOf(editing), 1);

      return res;
    });
  };
  return (
    <Box className="pb-3 px-4 mt-3">
      {cart.length > 0 ? (
        <ProductPicker product={editingItem?.product} selected={editingItem}>
          {({ open }) => (
            <ListRenderer
              items={cart}
              limit={3}
              // onClick={(item) => {
              //   if (disableClick) {
              //     return;
              //   }
              //   setEditingItem(item);
              //   open();
              // }}
              renderKey={({ product, options, quantity }) =>
                JSON.stringify({ product: product.id, options, quantity })
              }
              renderLeft={(item) => (
                <Checkbox
                  size="small"
                  value=""
                  checked={item.selected}
                  onChange={() => onCheckProduct(item)}
                />
              )}
              renderRight={(item) => (
                <Box
                  flex
                  className=""
                  onClick={(item) => {
                    if (disableClick) {
                      return;
                    }
                    setEditingItem(item);
                    open();
                  }}
                >
                  <img
                    className="w-24 h-24 max-w-none max-h-none rounded-lg"
                    src={item.product.thumbnail}
                  />
                  <Box className="space-y-1 ml-2 flex-1">
                    <Box>
                      <Box className="mb-1">
                        <Text size="small">{item.product.name}</Text>
                        <Text className="text-lg font-semibold" size="xSmall">
                          {disableClick ? (
                            <DisplayPrice>{item.product.total}</DisplayPrice>
                          ) : (
                            <FinalPrice options={item.options}>
                              {item.product}
                            </FinalPrice>
                          )}
                        </Text>
                        <Text className="text-gray" size="xxxSmall">
                          {isString(item.product.options) ? (
                            item.product.options
                          ) : (
                            <DisplaySelectedOptions options={item.options}>
                              {item.product}
                            </DisplaySelectedOptions>
                          )}
                        </Text>
                      </Box>
                      <QuantityPicker
                        value={item.quantity}
                        onChange={(value) => onChangeQuantity(item, value)}
                        noTitle={true}
                      />
                    </Box>
                  </Box>
                  {/* <Text className="text-primary font-medium" size="small">
                    x{item.quantity}
                  </Text> */}
                  <Box className="cursor-pointer" onClick={() => {onRemoveProduct(item)}}>
                    <Icon icon="zi-close-circle" />
                  </Box>
                </Box>
              )}
            />
          )}
        </ProductPicker>
      ) : (
        <Text
          className="bg-background rounded-xl py-8 px-4 text-center text-gray"
          size="xxSmall"
        >
          Không có sản phẩm trong giỏ hàng
        </Text>
      )}
    </Box>
  );
};
