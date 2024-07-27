import { DisplayPrice } from "components/display/price";
import { ListRenderer } from "components/list-renderer";
import LoadingScreenOverLay from "components/loading-screen";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import { TOrder } from "types/order";
import { getAddress } from "utils";
import { Box, Button, Header, Icon, Page, Text } from "zmp-ui";
import supabase from "../../client/client";
import OrderDetailList from "./order-detail-list";
import OrderInfo from "./order-info";

type Props = {};

function OrderDetail({}: Props) {
  const params = useParams();
  const navigate = useNavigate();

  const { id } = params;
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<TOrder | undefined>();
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select(
          `* , address: user_addresses(*), orderDetails: order_details(* , product:products(* , inventories:product_inventories(*)))`
        )
        .eq("userId", user.id)
        .eq("id", id);
      setDetail(data[0]);
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
      <Box className="px-2 mt-4">
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
      <Box className="px-2 mt-4"></Box>
      <OrderDetailList detail={detail?.orderDetails || []} />

      <Box className="px-4 py-2">
        <Button
          size="large"
          fullWidth
          onClick={() => navigate(`/edit-cart/${id}`)}
        >
          Chỉnh sửa giỏ hàng
        </Button>
      </Box>
      <Box className="px-2 mt-4">
        <Box className=" bg-background p-4 rounded-lg mb-4">
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
                  <Text className={'text-nature-500 font-bold'}>
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
      <Box className="mb-4" />
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
