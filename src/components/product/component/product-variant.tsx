import { capitalize } from "lodash";
import React from "react";
import { Box, Radio, Text } from "zmp-ui";

type Props = {
  variant: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
};

function ProductVariant({ variant, value, values, onChange }: Props) {
  const variantLabel = capitalize(variant).replace("_", "");
  return (
    <Box my={8} className="space-y-2">
      <Text.Title size="small">{variantLabel}</Text.Title>
      <Radio.Group
        className="flex-1 grid grid-cols-3 justify-between text-xs"
        name={variant}
        options={values.map((option) => ({
          value: option,
          label: option,
        }))}
        value={value}
        onChange={(selectedOption: string) => {
          onChange(selectedOption);
        }}
      />
    </Box>
  );
}

export default ProductVariant;
