import { capitalize } from "lodash";
import React from "react";
import { Box, Button, Radio, Text } from "zmp-ui";

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
      <Text.Title size="small" className="font-bold mb-1">
        {variantLabel}
      </Text.Title>
      {values.map((option) => {
        const isActive = option === value;
        return (
          <Button
            onClick={() => {
              onChange(option);
            }}
            className={`rounded-xl h-12 px-3  border-2 min-w-min border-solid mr-2 ${
              !isActive
                ? "!text-black border-slate-400"
                : "text-blue-500 border-blue-400"
            }`}
            variant={"tertiary"}
          >
            {option}
          </Button>
        );
      })}
    </Box>
  );
}

export default ProductVariant;
