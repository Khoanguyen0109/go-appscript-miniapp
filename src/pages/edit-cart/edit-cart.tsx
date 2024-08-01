import { Divider } from "components/divider";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  editCartState,
  globalProductInventoriesSelector,
  mapProduct,
} from "state";
import { Header, Page, Text } from "zmp-ui";
import supabase from "../../client/client";
import LoadingScreenOverLay from "../../components/loading-screen";
import { EditCartItems } from "./edit-cart-items";
import { EditCartPreview } from "./preview";
import { getSelectedInventories } from "../../utils/getSelectedInventories";

type Props = {};

function EditCartPage({}: Props) {
  const params = useParams();

  const { id } = params;
  const [loading, setLoading] = useState(true);
  const cart = useRecoilValue(editCartState);
  const setCart = useSetRecoilState(editCartState);
  const globalInventories = useRecoilValue(globalProductInventoriesSelector);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("order_details")
        .select(
          `*,product:products(*,categories:categories(*),inventories:product_inventories(*))`
        )
        .eq("orderId", id);
      if (error) {
        throw error;
      }

      if (data) {
        const mappedData = data.map((item) => ({
          id: item.id,
          price: item.total.toString(),
          options: getSelectedInventories(item, globalInventories),
          selected: false,
          quantity: item.quantity,
          product: mapProduct(item.product),
        }));
        console.log("Mapped data:", mappedData);
        setCart(mappedData);
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
      <EditCartItems disableClick={false} editable={true} />
      {cart.length > 0 && (
        <>
          {/* <Delivery isShowVoucher={false} /> */}
          {/* <Box className="mb-3">
            <Text className="text-md font-bold px-2">Thời gian nhận hàng</Text>
            <Box className="flex p-2 justify-between w-screen">
              <TimePicker />
            </Box>
          </Box> */}
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
          {/* <EditCartPreviewInfo /> */}
        </>
      )}

      <Divider size={12} className="flex-1" />

      <EditCartPreview />
    </Page>
  );
}

export default EditCartPage;
