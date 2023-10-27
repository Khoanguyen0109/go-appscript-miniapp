import { ListRenderer } from "components/list-renderer";
import { ROUTES } from "pages/route";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { orderState } from "state";
import { Box, Header, Icon, Page, Text } from "zmp-ui";

type Props = {};

function Order({}: Props) {
  const navigate = useNavigate()
  const orders = useRecoilValue(orderState);
  const navigateToDetail = (id) =>{
    navigate((ROUTES.ORDER_DETAIL(id)))
  }
  return (
    <Page>
      <Header title="Lịch sử đặt hàng" showBackIcon={true} />
      <Box className="py-3 px-4">
        <ListRenderer
          items={orders}
          onClick={(item)=> {
            console.log('item', item)
            navigateToDetail(item.id)
          }}
          renderKey={(item) => item.id}
          renderLeft={(item) => (
            <Text> MDH: {item.id}</Text>
            // <img className="w-10 h-10 rounded-lg" src={item.product.image} />
          )}
          renderRight={(item) => (
            <Box flex className="space-x-3 text-right">
              <Box className="space-y-1 flex-1">
                <Text size="small"> {item.created_at}</Text>
                <Text size="small">{item.total} VND</Text>
              </Box>
              <Box className="ml-12">
                <Icon icon="zi-chevron-right"/>
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
      </Box>
    </Page>
  );
}

export default Order;
