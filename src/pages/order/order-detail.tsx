import { axiosInstance } from "api/instance";
import { Divider } from "components/divider";
import LoadingScreenOverLay from "components/loading-screen";
import { CartItems } from "pages/cart/cart-items";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import { Box, Header, Icon, Page, Text } from "zmp-ui";
import OrderStatus from "./order-status";
import OrderInfo from "./order-info";
import { ListRenderer } from "components/list-renderer";
import { ListItem } from "components/list-item";
import { getAddress } from "utils";
import { TOrder } from "types/order";
import { DisplayPrice } from "components/display/price";

type Props = {};

function OrderDetail({}: Props) {
  const params = useParams();
  const { id } = params;
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<TOrder | undefined>();
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/orders/${user.id}/details/${id}`);
      setDetail(res.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    return () => {};
  }, []);
  if (loading) {
    return <LoadingScreenOverLay />;
  }

  return (
    <Page className="flex flex-col">
      <Header title="Chi tiết đơn hàng" showBackIcon={true} />
      <OrderInfo item={detail} />
      <Box className="px-4">
        <Text.Title className="mb-4">Thông tin địa chỉ</Text.Title>

        <Box className="flex bg-background p-4 rounded-lg ">
          <Icon icon="zi-location" className="my-auto mr-3" />
          <Box>
            <Text>Địa chỉ nhận hàng</Text>
            <Text className="font-semibold">{getAddress(detail?.address)}</Text>
            {detail?.address && (
              <Text>
                {detail?.address.name} * {detail?.address.phone}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
      <Box className="px-4 pt-4">
        <Text.Title className="mb-4">Thông tin sản phẩm</Text.Title>
      </Box>
      <CartItems cart={detail?.detail || []} />
      <Box className="px-4 pt-4">
        <Text.Title className="mb-4">Thông tin thanh toán</Text.Title>
        <Box className=" bg-background p-4 rounded-lg mb-3">
          <Text>Phương thức thanh toán</Text>
          <Text className="font-bold">{detail?.payment_method}</Text>
        </Box>

        {/* <Box className="flex bg-background mt-3 p-4 rounded-lg "> */}
        <ListRenderer
          items={[
            {
              left: <Box></Box>,
              right: (
                <Box flex>
                  <Text.Header className="flex-1 items-center font-normal">
                    Tổng tiền
                  </Text.Header>
                  <Text>
                    <DisplayPrice>{detail?.total}</DisplayPrice>
                  </Text>
                </Box>
              ),
            },
            // {
            //   left: <Box></Box>,
            //   right: (
            //     <Box flex>
            //       <Text.Header className="flex-1 items-center font-normal">
            //         Phí vận chuyển
            //       </Text.Header>
            //       <DisplayPrice>{detail?.fee}</DisplayPrice>
            //     </Box>
            //   ),
            // },
            // {
            //   left: <Box></Box>,
            //   right: (
            //     <Box flex className="items-center">
            //       <Text.Header className="flex-1 items-center font-normal">
            //         Tổng tiền
            //       </Text.Header>
            //       <DisplayPrice>{detail?.fee}</DisplayPrice>
            //     </Box>
            //   ),
            // },
          ]}
          renderLeft={(item) => item.left}
          renderRight={(item) => item.right}
        />
      </Box>
      <Box className="mb-4"/>
      {/* </Box> */}
      {/* <Divider size={32} className="flex-1" />

      <Box flex className="sticky bottom-0 bg-background p-4 space-x-4">
        <Box>
          <Text>Tổng: {detail?.total || 0} đ</Text>
        </Box>
      </Box> */}
    </Page>
  );
}

export default OrderDetail;
