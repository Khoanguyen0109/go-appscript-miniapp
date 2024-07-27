import { ListRenderer } from "components/list-renderer";
import React from "react";
import { TOrder } from "types/order";
import { Box, Text } from "zmp-ui";
import { formatDate } from "../../utils/date";
import ReturnStatus from "./return-status";


type Props = {
  item: TOrder;
};

function ReturnInfo({ item }: Props) {
  return (
    <Box className="p-2">
      <ListRenderer
        items={[
          {
            left: <Box></Box>,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Mã đơn hoàn
                </Text.Header>
                <Text>{item.id}</Text>
              </Box>
            ),
          },
          {
            left: <Box></Box>,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Ngày đặt hoàn đơn
                </Text.Header>
                <Text>{formatDate(item.createdAt)}</Text>
              </Box>
            ),
          },
          {
            left: <Box></Box>,
            right: (
              <Box flex className="items-center">
                <Text.Header className="flex-1 items-center font-normal">
                  Trạng thái
                </Text.Header>
                <ReturnStatus status={item.status} />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
}

export default ReturnInfo;
