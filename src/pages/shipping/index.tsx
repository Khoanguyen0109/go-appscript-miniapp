import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, Header, Page, Tabs, Text } from "zmp-ui";
import {
  selectedShippingStatusState,
  shippingListSelectorByStatus,
} from "../../state/shipping-state";
import { EOrderStatus } from "../../constantsapp";
import { getOrderStatusLabel } from "../../utils";
import { DisplayPrice } from "../../components/display/price";

type Props = {};

function Shipping({}: Props) {
  const [selectedStatus, setSelectedStatus] = useRecoilState(
    selectedShippingStatusState
  );
  console.log("selectedStatus", selectedStatus);
  const orderList = useRecoilValue(shippingListSelectorByStatus);

  return (
    <Page>
      <Header title="Đơn hàng" className="text-center" />

      <Tabs
        scrollable
        activeKey={selectedStatus.toString()}
        defaultActiveKey={EOrderStatus.WAITING}
        className="category-tabs"
        onTabClick={(key) => setSelectedStatus(key)}
      >
        {Object.values(EOrderStatus).map((key) => (
          <Tabs.Tab key={key} label={getOrderStatusLabel(key)}>
            {orderList.map((order) => {
              return (
                <Box className="bg-white p-3 rounded-lg">
                  <Box>
                    <Box>
                      <Text>{order.id}</Text>
                    </Box>
                    <Box>
                      <Text>
                        <DisplayPrice>{order.shipperCommission}</DisplayPrice>
                      </Text>
                      <Text>Hoa Hồng</Text>
                    </Box>
                  </Box>
                  <Box className="border-t-[1px] border-dashed border-neutral-400">
                    <Box>
                        <Text></Text>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Tabs.Tab>
        ))}
      </Tabs>
    </Page>
  );
}

export default Shipping;
