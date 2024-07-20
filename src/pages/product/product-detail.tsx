import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {
  Box,
  Button,
  Header,
  ImageViewer,
  Page,
  Text,
  useNavigate,
} from "zmp-ui";
import {truncate} from "lodash";
import {Banner} from "components/banner/banner";
import {DisplayPrice} from "components/display/price";
import {Divider} from "components/divider";
import {ProductPicker} from "components/product/picker";

import {productsState, userState} from "state";
import {openChat, openShareSheet} from "zmp-sdk";
import {FaShare} from "react-icons/fa";
import {IoChatboxEllipses} from "react-icons/io5";
import {OA_ID} from "enviroment";
import LoadingScreenOverLay from "components/loading-screen";
import {useLocation, useParams} from "react-router-dom";
import supabase from "../../client/client";
import {selectedProductState} from "./state";
import {formatPrice} from "../../utils/price";

import shareIcon from "../../static/icons/share.svg";
import chatOaIcon from "../../static/icons/chatOaFilled.svg";
import {BannerProduct} from "../../components/banner/bannerProduct";

type Props = {};

function ProductDetail({}: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const user = useRecoilValue(userState);
  const products = useRecoilValue(productsState);

  const [productSelected, setProductSelected] =
    useRecoilState(selectedProductState);
  const paramsSearch = new URLSearchParams(location.search);
  const ctvId = paramsSearch.get("id_ctv_shared");
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const shareCurrentPage = async () => {
    if (productSelected) {
      try {
        const data = await openShareSheet({
          type: "zmp_deep_link",
          data: {
            title:
              productSelected?.name + " " + formatPrice(productSelected?.price),
            description: productSelected?.descThumbnail || "",
            thumbnail: productSelected?.thumbnail,
            path: user?.ctv
              ? `${location.pathname}?id_ctv_shared=${user.id}`
              : `${location.pathname}`,
          },
        });
      } catch (err) {
        console.log("error", err);
      }
    }
  };

  useEffect(() => {
    if (params?.id) {
      const product = products.find((item) => item.id === Number(params?.id));
      if (product) {
        setProductSelected(product);
      }
    }
  }, [params?.id, products]);

  const openChatScreen = () => {
    openChat({
      type: "oa",
      id: OA_ID,
      message: `Tư vấn mua: ${productSelected?.name}`,
      success: () => {
      },
      fail: (err) => {
        console.log("err", err);
      },
    });
  };

  const saveCTV = async (ctvId) => {
    try {
      await supabase
        .from("users")
        .update({idCTVShared: ctvId})
        .eq("id", user.id);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (ctvId) {
      saveCTV(ctvId);
    }
  }, []);

  if (!productSelected) {
    return <LoadingScreenOverLay/>;
  }
  return (
    <Page className="flex flex-col bg-background">
      <Header
        title={truncate(productSelected.name, {length: 24})}
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
      />
      <ImageViewer
        onClose={() => setVisible(false)}
        activeIndex={activeIndex}
        images={productSelected?.image.map((item) => ({src: item.image}))}
        visible={visible}
      />
      <BannerProduct
        banners={productSelected.image}
        onClick={() => setVisible(true)}
      />
      {productSelected?.image.length > 1 && (
        <Box className="flex gap-4 p-4 overflow-x-auto">
          {productSelected.image.map((item) => (
            <Box
              className="w-1/4 rounded-xl aspect-[1/1] bg-cover bg-center bg-skeleton"
              style={{backgroundImage: `url(${item.image})`}}
            />
          ))}
        </Box>
      )}
      <Box className="p-3">
        <Text.Header className="text-lg font-bold">
          {productSelected.name}
        </Text.Header>
        <Box className="flex justify-between items-center">
          <Text size="xLarge" className=" mt-2 pb-2 text-blue-500 font-bold">
            <DisplayPrice>{productSelected.price}</DisplayPrice>
          </Text>
          <Box className="flex items-center">
            <Box
              className="mr-3 p-2 rounded-full"
              onClick={() => shareCurrentPage()}
            >
              <img src={shareIcon} alt="Share"/>
            </Box>
            <Box
              className="mr-3 p-2 rounded-full"
              onClick={() => openChatScreen()}
            >
              <img src={chatOaIcon} alt="Chat OA"/>
            </Box>
          </Box>
        </Box>
        <Divider size={1} className="flex-1 bg-divider"/>
        <Text className="mt-3 ">
          <Text className={'font-semibold'}>Mô tả sản phẩm</Text>
          {productSelected.desc.indexOf("</") !== -1 ? (
            <div
              dangerouslySetInnerHTML={{
                __html: productSelected.desc.replace(
                  /(<? *script)/gi,
                  "illegalscript"
                ),
              }}
            ></div>
          ) : (
            productSelected.desc
          )}
        </Text>
        <Divider size={1} className="flex-1 my-2 bg-divider"/>
        <Text className="mt-3 ">
          <Text className={'font-semibold'}>Thông tin chi tiết</Text>

          {productSelected.desc.indexOf("</") !== -1 ? (
            <div
              dangerouslySetInnerHTML={{
                __html: productSelected.desc.replace(
                  /(<? *script)/gi,
                  "illegalscript"
                ),
              }}
            ></div>
          ) : (
            productSelected.desc
          )}
        </Text>
      </Box>
      <Divider size={32} className="flex-1"/>

      <Box
        flex
        className="sticky bottom-0 w-full bg-background  p-2 space-x-4 justify-end"
      >
        <ProductPicker product={productSelected}>
          {({open, openRedirect}) => (
            <>
              <Button
                style={{borderColor: "#006af5ƒ"}}
                className="w-full border border-solid text-xs"
                onClick={() => open()}
              >
                Thêm vào giỏ
              </Button>
            </>
          )}
        </ProductPicker>
      </Box>
    </Page>
  );
}

export default ProductDetail;
