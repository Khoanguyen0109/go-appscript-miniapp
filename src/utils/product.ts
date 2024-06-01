import { createOrder } from "zmp-sdk";
import { Product } from "types/product";
import { getConfig } from "./config";
import { SelectedOptions } from "types/cart";
import { capitalize, chain, isEqual, omit } from "lodash";

export const findVariant = (product, options) => {
  return product?.inventories?.find((item) => {
    // const object = chain(item)
    //   .omit([
    //     "id",
    //     "product_id",
    //     "discount",
    //     "price",
    //     "image",
    //     "active",
    //     "created_at",
    //     "updated_at",
    //     "deleted_at",
    //   ])
    //   .omitBy((value) => value === "")
    //   .value();
    // console.log('object', object)
    const option = Object.values(options || {})?.[0];
    return isEqual(item.id, option?.id);
  });
};

export function calcFinalPrice(product: Product, options?: SelectedOptions) {
  let finalPrice = product.costdown || product.price;
  // const variant = findVariant(product, options);
  // if (variant) {
  //   return variant.price;
  // }
  const totalOptionPrice = options
    ? Object.keys(options).reduce((acc, key) => acc + options[key].price, 0)
    : 0;
  return finalPrice + totalOptionPrice;
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

const pay = (amount: number, callback: (data: any) => void) => {
  return createOrder({
    desc: `Thanh toán cho ${getConfig((config) => config.app.title)}`,
    item: [],
    amount: amount,
    success: (data) => {
      console.log("data", data);
      callback(data);
    },
    fail: (err) => {
      console.log("Payment error: ", err);
    },
  });
};

export default pay;

export const getOptionString = (options) => {
  if (!options) {
    return "";
  }
  let variants: string[] = [];
  for (const [key, value] of Object.entries(options)) {
    variants.push(`${capitalize(key.replace("_", ""))}: ${value.name}`);
  }
  console.log("first", variants);
  return variants.join(". ");
};
