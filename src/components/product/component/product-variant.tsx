import { capitalize } from "lodash";
import React from "react";
import { Box, Button, Checkbox, Radio, Text } from "zmp-ui";
import { DisplayPrice } from "../../display/price";

type Props = {
  variant: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
};

function ProductVariant({ variant, value, values, onChange }: Props) {
  const variantLabel = capitalize(variant);
  return (
    <Box my={8} className="space-y-2">
      <Text.Title size="small" className="font-bold mb-1">
        {variantLabel}
      </Text.Title>
      {values.map((option) => {
        console.log('option', option)
        const isActive = option?.name === value?.name;
        if (!option.status) {
          return <></>;
        }
        return (
          // <Button
          //   key={option.name}
          //   onClick={() => {
          //     onChange(option);
          //   }}
          //   className={`rounded-xl h-12 px-3  border-2 min-w-min border-solid mr-2 ${
          //     !isActive
          //       ? "!text-black border-slate-400"
          //       : "text-blue-500 border-blue-400"
          //   }`}
          //   variant={"tertiary"}
          // >
          //   {option.name}
          // </Button>
          <Box key={option.id} className="flex ">
            {option.image && (
              <img className="w-12 h-12 mr-2" src={option.image} />
            )}
            <Box className="flex-1">
              <Text>{option.name}</Text>
              <Text>
                {" "}
                <DisplayPrice>{option.price}</DisplayPrice>{" "}
              </Text>
            </Box>
            <Checkbox
              value=""
              checked={isActive}
              onChange={() => {
                onChange(option);
              }}
            ></Checkbox>
          </Box>
        );
      })}
    </Box>
  );
}

export default ProductVariant;
