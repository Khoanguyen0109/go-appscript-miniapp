import { ListRenderer } from "components/list-renderer";
import { ROUTES } from "pages/route";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { forceOrderUpdate, orderState } from "state";
import { Box, Header, Icon, List, Page, Tabs, Text } from "zmp-ui";
import { EOrderStatus } from "./order-status";
import "./index.css";
type Props = {};

function Order({}: Props) {
  const navigate = useNavigate();
  const orderUpdate = useSetRecoilState(forceOrderUpdate);

  const orders = useRecoilValue(orderState);
  const forceUpdate = () => orderUpdate((n) => n + 1);

  const navigateToDetail = (id) => {
    navigate(ROUTES.ORDER_DETAIL(id));
  };
  useEffect(() => {
    return () => {
      forceUpdate();
    };
  }, []);
  const iconStatus = (status) => {
    switch (status) {
      case EOrderStatus.WAITING:
        return {
          icon: "zi-clock-1",
          color: "text-grey",
        };
      case EOrderStatus.DELIVERING:
        return { icon: "zi-leave", color: "text-yellow" };
      case EOrderStatus.DELIVERED:
        return {
          icon: "zi-check-circle",
          color: " text-green",
        };

      case EOrderStatus.CANCEL:
        return {
          icon: "zi-close",
          color: "text-red",
        };
      default:
        break;
    }
  };
  return (
    <Page className="bg-background">
      <Header title="Lịch sử đặt hàng" showBackIcon={true} />
      {/* <Tabs
        className="w-full"
        id="contact-list"
        renderTabBar={(props) => {
          return (
            <Box className="flex w-full">
              {props.panes.map((item) => (
                <Box onClick={ props.onTabClick} className="w-1/4 text-center">
                  {item.props.label}
                </Box>
              ))}
            </Box>
          );
        }}
      >
        <Tabs.Tab key="tab2" label="Tab 2">ssss</Tabs.Tab>
        <Tabs.Tab key="tab3" label="Tab 3">aaa</Tabs.Tab>
      </Tabs> */}
      <Box className="py-3 px-4">
        {orders.length === 0 ? (
          <Text
            className="bg-background rounded-xl py-8 px-4 text-center text-gray"
            size="xxSmall"
          >
            Không có đơn hàng
          </Text>
        ) : (
          <ListRenderer
            items={orders}
            onClick={(item) => {
              navigateToDetail(item.id);
            }}
            renderKey={(item) => item.id}
            renderLeft={(item) => {
              const { icon, color } = iconStatus(item.status);
              return (
                <Box>
                  <Icon icon={icon} className={`${color}`} />
                </Box>
                // <img className="w-10 h-10 rounded-lg" src={item.product.image} />
              );
            }}
            renderRight={(item) => (
              <Box flex className="space-x-3 ">
                <Box className="space-y-1 flex-1">
                  <Text className="font-semibold"> MDH: {item.id}</Text>

                  <Text size="small">Ngày đặt: {item.created_at}</Text>
                  <Text size="small">Tổng: {item.total} VND</Text>
                </Box>
                <Box className="ml-12">
                  <Icon icon="zi-chevron-right" />
                </Box>
              </Box>
            )}
            // renderRight={(item) => (
            //   <Box flex className="space-x-1">
            //     <Box className="space-y-1 flex-1">
            //       <Text size="small">{item.product.name}</Text>
            //       <Text className="text-gray" size="xSmall">
            //         <FinalPrice options={item.options}>{item.product}</FinalPrice>
            //       </Text>
            //       <Text className="text-gray" size="xxxSmall">
            //         <DisplaySelectedOptions options={item.options}>
            //           {item.product}
            //         </DisplaySelectedOptions>
            //       </Text>
            //     </Box>
            //     <Text className="text-primary font-medium" size="small">
            //       x{item.quantity}
            //     </Text>
            //   </Box>
            // )}
          />
        )}
      </Box>
    </Page>
  );
}

export default Order;
