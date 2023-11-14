import { createOrder } from "zmp-sdk";
import { Option, Product } from "types/product";
import { getConfig } from "./config";
import { SelectedOptions } from "types/cart";
import { capitalize, chain, isEqual, omit } from "lodash";

export const findVariant = (product, options) => {
  console.log('product', product)
  console.log('options', options)
  return product?.inventories?.find((item) => {
    const object = chain(item)
      .omit([
        "id",
        "product_id",
        "inventory_quantity",
        "discount",
        "price",
        "image",
        "active",
        "created_at",
        "updated_at",
        "deleted_at",
      ])
      .omitBy((value) => value === "")
      .value();
    return isEqual(object, options);
  });
};

export function calcFinalPrice(product: Product, options?: SelectedOptions) {
  let finalPrice = product.price;
  const variant = findVariant(product, options);
  if (variant) {
    return variant.price;
  }

  return finalPrice;
}

export function getDummyImage(filename: string) {
  return `https://zalo-miniapp.github.io/zaui-coffee/dummy/${filename}`;
}

export function isIdentical(
  option1: SelectedOptions,
  option2: SelectedOptions
) {
  const option1Keys = Object.keys(option1);
  const option2Keys = Object.keys(option2);

  if (option1Keys.length !== option2Keys.length) {
    return false;
  }

  for (const key of option1Keys) {
    const option1Value = option1[key];
    const option2Value = option2[key];

    const areEqual =
      Array.isArray(option1Value) &&
      Array.isArray(option2Value) &&
      [...option1Value].sort().toString() ===
        [...option2Value].sort().toString();

    if (option1Value !== option2Value && !areEqual) {
      return false;
    }
  }

  return true;
}

const pay = async (amount: number, callback?: any, description?: string) =>
  await createOrder({
    desc:
      description ??
      `Thanh toán cho ${getConfig((config) => config.app.title)}`,
    item: [],
    amount: amount,
    success: (data) => {
      console.log("Payment success: ", data);
      callback(data);
      return data;
    },
    fail: (err) => {
      console.log("Payment error: ", err);
    },
  });

export default pay;

export const getOptionString = (options) => {
  if (!options) {
    return "";
  }
  let variants: string[] = [];
  for (const [key, value] of Object.entries(options)) {
    variants.push(`${capitalize(key.replace("_", ""))}: ${value}`);
  }
  return variants.join(". ");
};
