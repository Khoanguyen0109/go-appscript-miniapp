import { capitalize, isEqual } from "lodash";
import { SelectedOptions } from "types/cart";
import { Product } from "types/product";
import { createOrder } from "zmp-sdk";
import { getConfig } from "./config";

export const findVariant = (product, options) => {
  return product?.inventories?.find((item) => {
    const option = Object.values(options || {})?.[0];
    return isEqual(item.id, option?.id);
  });
};

export function calcFinalPrice(product: Product, options?: SelectedOptions) {
  console.log("options", options);
  console.log("product", product);

  if (
    !options ||
    typeof options !== "object" ||
    Object.keys(options).length === 0 ||
    (Object.keys(options).length === 1 &&
      (options["Phân loại"]?.length === 0 ||
        (options["Phân loại"]?.length === 1 &&
          Object.keys(options["Phân loại"][0]).length === 0)))
  ) {
    return product.costdown || product.price;
  }

  if (
    !options ||
    typeof options !== "object" ||
    Object.keys(options).length === 0
  ) {
    return product.costdown || product.price;
  }

  const totalOptionPrice = Object.values(options).reduce((acc, optionArray) => {
    if (Array.isArray(optionArray)) {
      return (
        acc + optionArray.reduce((sum, item) => sum + (item.price || 0), 0)
      );
    }
    return acc;
  }, 0);

  return totalOptionPrice;
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

export const isIdenticalV2 = (
  option1: SelectedOptions,
  option2: SelectedOptions
) => {
  return isEqual(JSON.stringify(option1), JSON.stringify(option2));
};

const pay = (amount: number, callback: (data: any) => void) => {
  return createOrder({
    desc: `Thanh toán cho ${getConfig((config) => config.app.title)}`,
    item: [],
    amount: amount,
    success: (data) => {
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
    variants.push(
      `${capitalize(key.replace("_", ""))}: ${options[key]
        .map((item) => item.name)
        .join(",")}`
    );
  }
  return variants.join(". ");
};
