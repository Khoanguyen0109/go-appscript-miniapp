import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { productDetailState, selectedProductIdState } from "./state";
import { Box, Button, Header, Page, Swiper, Text, useNavigate } from "zmp-ui";
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
import { openChat, openShareSheet } from "zmp-sdk";
import { FaShare } from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { OA_ID } from "enviroment";
import Loading from "components/loading";
import LoadingScreenOverLay from "components/loading-screen";
import { axiosInstance } from "api/instance";
import { useLocation, useParams } from "react-router-dom";

type Props = {};

function ProductDetail({}: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  console.log("params", params);
  const paramsSearch = new URLSearchParams(location.search);
  const cart = useRecoilValue(cartState);
  const queryParams = new URLSearchParams(window.location.search);
  const env = queryParams.get("env");
  const version = queryParams.get("version");
  const setCart = useSetRecoilState(cartState);
  const [productDetail, setProductDetail] = useState();
  console.log("productDetail", productDetail);

  const shareCurrentPage = async () => {
    try {
      const data = await openShareSheet({
        type: "zmp_deep_link",
        data: {
          title: productDetail.name,
          description: productDetail?.desc_thumbnail || "",
          thumbnail: productDetail.thumbnail,
          path: `${ROUTES.PRODUCT_DETAIL(params.id)}`,
        },
      });
    } catch (err) {
      console.log("error", err);
    }
  };

  const openChatScreen = () => {
    openChat({
      type: "oa",
      id: OA_ID,
      message: "Xin Chào",
      success: () => {},
      fail: (err) => {
        console.log("err", err);
      },
    });
  };

  const getProductDetail = async () => {
    try {
      const res = await axiosInstance(`/products/${params?.id || 2}`);
      setProductDetail(res.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getProductDetail();
  }, [params]);

  if (!productDetail) {
    return <LoadingScreenOverLay />;
  }

  return (
    <Page className="flex flex-col bg-background">
      <Header
        title={truncate(productDetail.name, { length: 24 })}
        showBackIcon={true}
      />
      <Banner banners={productDetail.image} />
      {productDetail?.image.length > 1 && (
        <Box className="flex gap-4 p-4 overflow-x-auto">
          {productDetail.image.map((item) => (
            <Box
              className="w-1/4 rounded-xl aspect-[1/1] bg-cover bg-center bg-skeleton"
              style={{ backgroundImage: `url(${item.image})` }}
            />
          ))}
        </Box>
      )}
      <Box className="p-4">
        <Text.Header className="text-lg font-bold">
          {productDetail.name}
        </Text.Header>
        <Box className="flex justify-between items-center">
          <Text size="xLarge" className=" mt-2 pb-2 text-blue-500 font-bold">
            <DisplayPrice>{productDetail.price}</DisplayPrice>
          </Text>
          <Box className="flex items-center">
            <Box
              className="mr-3 bg-slate-100 p-2 rounded-full"
              onClick={() => openChatScreen()}
            >
              <IoChatboxEllipses className="text-blue-600" />
            </Box>
            <Box
              className="mr-3 bg-slate-100 p-2 rounded-full"
              onClick={() => shareCurrentPage()}
            >
              <FaShare className="text-blue-600" />
            </Box>
          </Box>
        </Box>
        <Box>
          <div className="rated-stars">
            <div
              className="star-ratings-css"
              data-rate={productDetail?.rating || 5}
            ></div>
          </div>
        </Box>

        {/* <Text.Header className="text-md font-bold mb-4">
          Mô tả sản phẩm
        </Text.Header> */}
        <Text className="mt-3 ">
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
        <ProductPicker product={productDetail}>
          {({ open, openRedirect }) => (
            <>
              <Button
                style={{ borderColor: "#006af5ƒ" }}
                className="w-full border border-solid text-xs"
                variant="secondary"
                onClick={() => open()}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                className="w-full !border text-xs"
                onClick={() => openRedirect()}
              >
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
