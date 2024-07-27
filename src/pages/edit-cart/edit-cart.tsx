import { Divider } from "components/divider";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  calPointUserSelector,
  editCartState,
  mapProduct,
  totalQuantityState,
} from "state";
import { Box, Button, Header, Page, Text } from "zmp-ui";
import supabase from "../../client/client";
import LoadingScreenOverLay from "../../components/loading-screen";
import { TOrder } from "../../types/order";
import { EditCartItems } from "./edit-cart-items";
import { EditCartPreview } from "./preview";
import {Delivery} from "../cart/delivery";
import {TimePicker} from "../cart/time-picker";
import PreviewInfo from "../cart/previewInfo";
import EditCartPreviewInfo from "./previewInfo";

type Props = {};

function EditCartPage({}: Props) {
  const params = useParams();

  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<TOrder | undefined>();
  const quantity = useRecoilValue(totalQuantityState);
  const cart = useRecoilValue(editCartState);
  const setCart = useSetRecoilState(editCartState);

  const calPointUser = useRecoilValue(calPointUserSelector);
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("order_details")
        .select(
          `*,product:products(*,categories:categories(*),inventories:product_inventories(*))`
        )
        .eq("orderId", id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const mappedData = [
          {
            ...data,
            price: data.total.toString(),
            options: {},
            selected: false,
            product: mapProduct(data.product),
          },
        ].map(
          ({
            createdAt,
            id,
            inventoryIds,
            orderId,
            productId,
            total,
            status,
            ...rest
          }) => rest
        ) as TOrder[];
        console.log("Mapped data:", mappedData);
        setCart(mappedData);
        setDetail(mappedData);
      } else {
        console.log("No data found for id:", id);
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);
  if (loading) {
    return <LoadingScreenOverLay />;
  }
  return (
    <Page className="flex flex-col bg-background">
      <Header
        className="text-center"
        title={`Chỉnh sửa đơn hàng`}
        showBackIcon={true}
      />

      <Text className="px-2 text-md font-bold">Chi tiết đơn hàng</Text>
      <EditCartItems disableClick={false} editable={true}/>
      {cart.length > 0 && (
        <>
          <Delivery isShowVoucher={false} />
          <Box className="mb-3">
            <Text className="text-md font-bold px-2">Thời gian nhận hàng</Text>
            <Box className="flex p-2 justify-between w-screen">
              <TimePicker />
            </Box>
          </Box>
          {/*{calPointUser && (*/}
          {/*  <Box>*/}
          {/*    <Text className="m-2 text-sm font-bold text-green">*/}
          {/*      {`Bạn  nhận dc ${*/}
          {/*        calPointUser * quantity*/}
          {/*      } xu tích lũy cho đơn hàng này`}*/}
          {/*    </Text>*/}
          {/*  </Box>*/}
          {/*)}*/}
          <Divider size={14} />
          <EditCartPreviewInfo />
        </>
      )}

      <Divider size={12} className="flex-1" />

      <EditCartPreview />
    </Page>
  );
}

export default EditCartPage;
