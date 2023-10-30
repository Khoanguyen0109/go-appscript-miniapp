import { capitalize } from "lodash";
import React, { FC, useMemo } from "react";
import { SelectedOptions } from "types/cart";
import { Product } from "types/product";

export const DisplaySelectedOptions: FC<{
  children: Product;
  options: SelectedOptions;
}> = ({ children, options }) => {
  console.log('first', options)
  const description = useMemo(() => {
    let variants: string[] = [];
    if (children.variants) {
      for (const [key, value] of Object.entries(options)) {
        variants.push(`${capitalize(key.replace('_',''))}: ${value}`)
      }
      // const selectedVariants = Object.keys(options);
      // children.variants
      //   .filter((v) => selectedVariants.includes(v.key))
      //   .forEach((variant) => {
      //     // if (variant.type === "single") {
      //     //   const selectedOption = variant.options.find(
      //     //     (o) => o.key === options[variant.key]
      //     //   );
      //     //   if (selectedOption) {
      //     //     variants.push(
      //     //       `${variant.label || variant.key}: ${
      //     //         selectedOption.label || selectedOption.key
      //     //       }`
      //     //     );
      //     //   }
      //     // } else {
      //     //   const selectedOptions = variant.options.filter((o) =>
      //     //     options[variant.key].includes(o.key)
      //     //   );
      //     //   variants.push(
      //     //     `${variant.label || variant.key}: ${selectedOptions
      //     //       .map((o) => o.label || o.key)
      //     //       .join(", ")}`
      //     //   );
      //     // }
      //   });
    }
    return variants.join(". ");
  }, [children]);
  return <>{description}</>;
};
