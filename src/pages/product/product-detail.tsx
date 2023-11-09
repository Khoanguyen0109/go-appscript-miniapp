import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { productDetailState } from "./state";
import { Box, Button, Header, Page, Swiper, Text } from "zmp-ui";
import { truncate } from "lodash";
import { Banner } from "components/banner/banner";
import { DisplayPrice } from "components/display/price";
import { Divider } from "components/divider";
import { ProductPicker } from "components/product/picker";
import { FinalPrice } from "components/display/final-price";
import { DisplaySelectedOptions } from "components/display/selected-options";
import { ListRenderer } from "components/list-renderer";
import { Pagination } from "swiper";
import { SwiperSlide } from "swiper/react";

type Props = {};

function ProductDetail({}: Props) {
  const productDetail = useRecoilValue(productDetailState);
  return (
    <Page className="flex flex-col bg-background">
      <Header
        title={truncate(productDetail.name, { length: 24 })}
        showBackIcon={true}
      />
      <Banner banners={productDetail.image} />
      <Box className="flex gap-4 p-4 overflow-x-auto">
        {productDetail.image.map((item) => (
          <Box
            className="w-1/4 rounded-xl aspect-[1/1] bg-cover bg-center bg-skeleton"
            style={{ backgroundImage: `url(${item.image})` }}
          />
        ))}
      </Box>
      <Box className="p-4">
        <Text.Header className="text-lg font-bold">
          {productDetail.name}
        </Text.Header>
        <Text size="xLarge" className=" mt-2 pb-2 text-blue-500 font-bold">
          <DisplayPrice>{productDetail.price}</DisplayPrice>
        </Text>
        <Text.Header className="text-md mt-5 font-bold">
          Mô tả sản phẩm
        </Text.Header>
        <Text className="mt-3">{productDetail.desc}</Text>
      </Box>
      <Divider size={32} className="flex-1" />

      <Box flex className="sticky bottom-0 w-full  p-4 space-x-4 justify-end">
        <ProductPicker product={productDetail}>
          {({ open }) => (
            <>
              <Button className="w-full" onClick={() => open()}>
                Thêm vào giỏ hàng
              </Button>
            </>
          )}
        </ProductPicker>
      </Box>
    </Page>
  );
}

export default ProductDetail;
