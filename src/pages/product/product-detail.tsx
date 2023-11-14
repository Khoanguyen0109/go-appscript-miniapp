import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
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
import { IoCartSharp } from "react-icons/io5";
import { ROUTES } from "pages/route";
import { CartIcon } from "components/cart-icon";
import { cartState } from "state";
import { isIdentical } from "utils/product";

type Props = {};

function ProductDetail({}: Props) {
  const navigate = useNavigate();
  const cart = useRecoilValue(cartState);
  const productDetail = useRecoilValue(productDetailState);
  const setCart = useSetRecoilState(cartState);

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
        <Text.Header className="text-md mt-5 font-bold mb-4">
          Mô tả sản phẩm
        </Text.Header>
        <Text>
          {productDetail.desc.indexOf("</") !== -1 ? (
            <div
              dangerouslySetInnerHTML={{
                __html: productDetail.desc.replace(
                  /(<? *script)/gi,
                  "illegalscript"
                ),
              }}
            ></div>
          ) : (
            productDetail.desc
          )}
        </Text>
      </Box>
      <Divider size={32} className="flex-1" />

      <Box
        flex
        className="sticky bottom-0 w-full bg-background  p-4 space-x-4 justify-end"
      >
        <ProductPicker  product={productDetail}>
          {({ open , openRedirect }) => (
            <>
              <Button
                style={{ borderColor: "#006af5ƒ" }}
                className="w-full border border-solid"
                variant="secondary"
                onClick={() => open()}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button className="w-full !border" onClick={() => openRedirect()}>
                Mua ngay
              </Button>
            </>
          )}
        </ProductPicker>
      </Box>
      {cart.length > 0 && (
        <Button
          onClick={() => navigate(ROUTES.CART)}
          className=" w-12 min-w-0 p-0 h-12 rounded-full fixed bottom-20 right-10 !bg-slate-100 text-white"
        >
          <CartIcon />
        </Button>
      )}
    </Page>
  );
}

export default ProductDetail;
