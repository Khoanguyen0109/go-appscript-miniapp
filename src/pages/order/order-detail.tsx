import { axiosInstance } from "api/instance";
import { Divider } from "components/divider";
import LoadingScreenOverLay from "components/loading-screen";
import { CartItems } from "pages/cart/cart-items";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import { Box, Header, Page, Text } from "zmp-ui";

type Props = {};

function OrderDetail({}: Props) {
  const params = useParams();
  const { id } = params;
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState({});

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/orders/${user.id}/details/${id}`);
      console.log("res", res);
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
      <CartItems cart={detail?.detail || []} />
      <Divider size={32} className="flex-1" />

      <Box flex className="sticky bottom-0 bg-background p-4 space-x-4">
        <Box>
          <Text>Tổng: {detail?.total || 0} đ</Text>
        </Box>
      </Box>
    </Page>
  );
}

export default OrderDetail;
