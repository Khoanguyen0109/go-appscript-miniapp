import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Button, Header, Page, Tabs, Text } from "zmp-ui";
import {
  selectedShippingStatusState,
  shippingDetailSelected,
  shippingListSelectorByStatus,
} from "../../state/shipping-state";
import { EOrderStatus } from "../../constantsapp";
import { getOrderStatusLabel } from "../../utils";
import { DisplayPrice } from "../../components/display/price";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../route";

type Props = {};

function Shipping({}: Props) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useRecoilState(
    selectedShippingStatusState
  );
  const setSelected = useSetRecoilState(shippingDetailSelected);
  const orderList = useRecoilValue(shippingListSelectorByStatus);

  const onItemClick = (item) => {
    console.log("item", item);
    setSelected(item);
    navigate(ROUTES.SHIPPING_DETAIL);
  };
  return (
    <Page>
      <Header title="Đơn hàng" className="text-center" showBackIcon={false} />

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
              const address = `${order.address}, ${order.ward}, ${order.district}, ${order.province}`;
              return (
                <Box className="bg-white p-3 rounded-xl mt-4 mx-2 shadow-md">
                  <Box className="flex justify-between mb-3">
                    <Box>
                      <Text className="text-lg font-semibold">
                        Mã đơn: {order.id}
                      </Text>
                    </Box>
                    <Box className="text-right">
                      <Text>
                        <DisplayPrice>{order.shipperCommission}</DisplayPrice>
                      </Text>
                      <Text>Hoa Hồng</Text>
                    </Box>
                  </Box>
                  <Box className="border-t-[1px] border-dashed border-neutral-400 mb-4 pt-4">
                    <Text className="mb-1">{order.name}</Text>
                    <Text className="mb-1">{address}</Text>
                    <Text className="mb-1">{order.phone}</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Box>
                      <Text className="text-blue-500 text-lg  font-semibold">
                        <DisplayPrice>{order.total}</DisplayPrice>
                      </Text>
                      <Text className="text-sm">Khách hàng trả</Text>
                    </Box>
                    <Button
                      variant="secondary"
                      className="border-[1px] border-solid !border-blue-500 rounded-md"
                      onClick={() => onItemClick(order)}
                    >
                      Xem đơn
                    </Button>
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
