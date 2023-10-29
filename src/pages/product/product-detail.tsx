import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { productDetailState } from "./state";
import { Box, Button, Header, Page, Text } from "zmp-ui";
import { truncate } from "lodash";
import { Banner } from "components/banner/banner";
import { DisplayPrice } from "components/display/price";
import { Divider } from "components/divider";
import { ProductPicker } from "components/product/picker";
import { FinalPrice } from "components/display/final-price";
import { DisplaySelectedOptions } from "components/display/selected-options";
import { ListRenderer } from "components/list-renderer";

type Props = {};

function ProductDetail({}: Props) {
  const productDetail = useRecoilValue(productDetailState);
  return (
    <Page className="flex flex-col">
      <Header
        title={truncate(productDetail.name, { length: 24 })}
        showBackIcon={true}
      />
      <Banner banners={productDetail.image} />

      <Box className="p-4">
        <Text.Header>{productDetail.name}</Text.Header>
        <Text className="text-blue-400 mt-3">
          <DisplayPrice>{productDetail.price}</DisplayPrice>
        </Text>
        <Text className="mt-10">
          {productDetail.desc}
        </Text>
      </Box>
      <Divider size={32} className="flex-1" />
  
      <Box
        flex
        className="sticky bottom-0 bg-background p-4 space-x-4 justify-end"
      >
        <ProductPicker product={productDetail}>
          {({ open }) => (
            <>
              <Button onClick={()=> open()}>Đặt hàng</Button>
            </>
          )}
        </ProductPicker>
      </Box>
    </Page>
  );
}

export default ProductDetail;
