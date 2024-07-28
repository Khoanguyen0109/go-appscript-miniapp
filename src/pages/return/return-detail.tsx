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
import ReturnDetailList from "./return-detail-list";
import ReturnInfo from "./return-info";


type Props = {};

function ReturnDetail({}: Props) {
  const params = useParams();
  console.log("params", params);
  const navigate = useNavigate();

  const { id } = params;
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<TOrder | undefined>();
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("returns")
        .select(
          `* , returnDetail: return_details(* , product:products(* , inventories:product_inventories(*)))`
        )
        .eq("userId", user.id)
        .eq("id", id);
      setDetail(data[0]);
      console.log('detail', data[0])
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
      <Header title="Chi tiết đơn hoàn" showBackIcon={true} className={'text-center'}/>
      <ReturnInfo item={detail} />
      <Box className="px-2 mt-4"></Box>
      <ReturnDetailList detail={detail?.returnDetail || []} />

      <Box className="px-2 mt-4">
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
          ]}
          renderLeft={(item) => item.left}
          renderRight={(item) => item.right}
        />
      </Box>
      <Box className="mb-4" />
    </Page>
  );
}

export default ReturnDetail;
