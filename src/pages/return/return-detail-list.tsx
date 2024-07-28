import React from "react";
import { Box, Text } from "zmp-ui";
import { DisplayPrice } from "../../components/display/price";
import { useRecoilValue } from "recoil";
import { globalProductInventoriesSelector } from "../../state";

function OrderDetailList({ detail }) {
  const imgSize = "w-24 h-24";
  const globalInventories = useRecoilValue(globalProductInventoriesSelector);
  console.log('detail',detail)
  return (
    <Box className="px-2">
      {detail.map((item) => {
        const selectedInventories = item.inventoryIds.split(",");
        const options = [...item.product.inventories, ...globalInventories].reduce(
          (acc, value) => {
            if (selectedInventories.includes(value.id.toString())) {
              acc.push(value);
            }
            return acc;
          },
          []
        );

        return (
          <Box key={item.id} flex className=" bg-background rounded-lg p-3">
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
                </Box>
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
