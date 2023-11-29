import React, { FC } from "react";
import { Box, Button, Icon, Text } from "zmp-ui";

export const QuantityPicker: FC<{
  value: number;
  onChange: (quantity: number) => void;
  noTitle?: boolean;
}> = ({ value, onChange, noTitle }) => {
  return (
    <Box flex className=" rounded-full items-center justify-between p-[6px]">
      {!noTitle && (
        <Text.Title size="small" className="font-bold mr-3">
          Số lượng
        </Text.Title>
      )}
      <Box flex className="w-2/3 justify-around">
        <Button
          disabled={value < 1}
          onClick={(e) => {
            e.stopPropagation();
            onChange(value - 1);
          }}
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
          onClick={(e) => {
            e.stopPropagation();
            onChange(value + 1);
          }}
          variant="secondary"
          type="neutral"
          icon={<Icon icon="zi-plus" />}
        />
      </Box>
    </Box>
  );
};
