import { capitalize, includes } from "lodash";
import React from "react";
import { Box, Button, Checkbox, Text } from "zmp-ui";
import { DisplayPrice } from "../../display/price";

type Props = {
  variant: string;
  value: string[];
  values: string[];
  onChange: (value: string) => void;
};

function ProductVariant({ variant, value, values, onChange }: Props) {
  const variantLabel = capitalize(variant);
  return (
    <Box my={2} className="space-y-2">
      <Text.Title size="small" className="font-bold mb-1">
        {variantLabel}
      </Text.Title>
      {values.map((option) => {
        const isActive = includes(value, option);
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
          <Button
            key={option.id}
            className={`w-full h-20 flex items-center ${
              isActive
                ? "bg-blue-100 border-blue-500"
                : "bg-white border-gray-300"
            } border rounded-lg p-2`}
            onClick={() => {
              onChange(isActive ? {} : option);
            }}
          >
            <Box className="flex w-full ">
              {option.image && (
                <img className="size-16 mr-2 rounded-md" src={option.image} alt={""} />
              )}
              <Box className="flex flex-col justify-between">
                <Text className={`${isActive ? 'text-white': 'text-black'}`}>{option.name}</Text>
                <Text className={`text-left ${isActive ? 'text-white': 'text-black'}`}>
                  <DisplayPrice>{option.price}</DisplayPrice>
                </Text>
              </Box>
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}

export default ProductVariant;
