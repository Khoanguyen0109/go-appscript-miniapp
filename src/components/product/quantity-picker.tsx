import React, { FC } from "react";
import { Box, Button, Icon, Text } from "zmp-ui";

export const QuantityPicker: FC<{
  value: number;
  onChange: (quantity: number) => void;
}> = ({ value, onChange }) => {
  return (
    <Box flex className=" rounded-full items-center justify-between p-[6px]">
      <Text.Title size="small" className="font-bold mr-3">
        Số lượng: {value}
      </Text.Title>
      <Box flex className="w-1/3 justify-around">
        <Button
          disabled={value < 1}
          onClick={() => onChange(value - 1)}
          variant="secondary"
          type="neutral"
          size="small"
          icon={
            <div className="py-2 px-1">
              <div className="w-full h-[2px] bg-black" />
            </div>
          }
        />

        <Box
          flex
          justifyContent="center"
          alignItems="center"
          className="flex-1"
        >
          <Text size="large" className="font-medium">
            {value}
          </Text>
        </Box>
        <Button
          size="small"
          onClick={() => onChange(value + 1)}
          variant="secondary"
          type="neutral"
          icon={<Icon icon="zi-plus" />}
        />
      </Box>
    </Box>
  );
};
