import { Sheet } from "components/fullscreen-sheet";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSetRecoilState } from "recoil";
import { cartState } from "state";
import { SelectedOptions } from "types/cart";
import { Product } from "types/product";
import { isIdentical } from "utils/product";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "pages/route";
import ProductInPicker from "./product-inpicker";

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
              isIdentical(item.options, options)
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
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          {product && (
            <ProductInPicker
              product={product}
              setVisible={setVisible}
              setOptions={setOptions}
              addToCart={addToCart}
              selected={selected}
              options={options}
              isRedirect={isRedirect}
            />
          )}
        </Sheet>,
        document.body
      )}
    </>
  );
};
