import React from "react";
import { ListRenderer } from "../../components/list-renderer";
import { Box, Text } from "zmp-ui";
import { DisplayPrice } from "../../components/display/price";
import { FinalPrice } from "../../components/display/final-price";
import { DisplaySelectedOptions } from "../../components/display/selected-options";
import { isString } from "lodash";

function OrderDetailList({ detail }) {
  const imgSize = "w-24 h-24";
  console.log("detail", detail);

  return (
    <Box className="px-2">
      {detail.map((item) => {
        console.log("item", item);
        const selectedInventories = item.inventoryIds.split(",");
        const options = item.product.inventories.reduce((acc, value) => {
          if (selectedInventories.includes(value.id.toString())) {
            acc.push(value);
          }
          return acc;
        }, []);
        console.log("options", options);

        return (
          <Box flex className=" bg-background rounded-lg p-3">
            <img
              className={`${imgSize} max-w-none max-h-none rounded-lg`}
              src={item.product.thumbnail}
            />
            <Box className="space-y-1 ml-4 flex-1">
              <Box>
                <Box className="mb-1">
                  <Text size="small" className="mt-1 mb-3 font-bold">
                    {item.product.name}
                  </Text>

                  <Text className="text-lg font-semibold" size="xSmall">
                    <DisplayPrice>{item.total}</DisplayPrice>
                  </Text>
                  <Text className="text-gray" size="xxxSmall">
                    {options.map((item) => item.name).join(",")}
                  </Text>
                  {/* <Text className="text-gray" size="xxxSmall">
                  {isString(item.inventory.product.options) ? (
                    item.inventory.product.options
                  ) : (
                    <DisplaySelectedOptions options={item.options}>
                      {item.inventory.product}
                    </DisplaySelectedOptions>
                  )}
                </Text> */}
                </Box>
                {/* {!disableClick && (
                <QuantityPicker
                  value={item.quantity}
                  onChange={(value) => onChangeQuantity(item, value)}
                  noTitle={true}
                />
              )} */}
              </Box>
            </Box>

            <Text className="text-black font-medium" size="small">
              x{item.quantity}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}

export default OrderDetailList;
