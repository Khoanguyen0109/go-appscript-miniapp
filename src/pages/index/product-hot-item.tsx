import React from "react";
import { FunctionComponent } from "react";
import { Box, Button, Icon, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { Product } from "types/product";
import { ROUTES } from "pages/route";
import { BsCartPlus, BsFire } from "react-icons/bs";
import { DisplayPrice } from "components/display/price";
import { ProductPicker } from "components/product/picker";
import { useSetRecoilState } from "recoil";
import { selectedProductState } from "pages/product/state";
import { BiPlus } from "react-icons/bi";

const { Title } = Text;

interface RestaurantProps {
  product: Product;
  before?: React.ReactNode;
  after?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ProductHotItem: FunctionComponent<RestaurantProps> = ({
  product,
  before,
  after,
  onClick,
}) => {
  const navigate = useNavigate();
  const setSelectedProductId = useSetRecoilState(selectedProductState);

  const viewDetail = () => {
    setSelectedProductId(product);
    navigate(ROUTES.PRODUCT_DETAIL(product.id));
  };
  return (
    <ProductPicker product={product}>
      {({ open }) => (
        <div
          onClick={onClick ?? viewDetail}
          className="relative bg-white mt-3 w-40 h-52 pb-3 overflow-hidden p-0 restaurant-with-cover shadow-md mb-3"
        >
          <div className="aspect-cinema relative h-24 w-full">
            <img
              src={product?.banner_image || product?.image[0].image}
              className="absolute w-full h-full  object-cover"
            />
          </div>
          {/* <div className="absolute left-1 top-3 py-1 px-2 space-x-1 flex items-center font-semibold text-sm text-white bg-primary rounded-full">
            <Icon icon="zi-star-solid" className="text-yellow-400" size={14} />
            <span>{product.rating}</span>
          </div> */}
          {/* <div className="absolute right-1 top-1  space-x-1 flex items-center font-semibold text-sm text-white  ">
            <Box className="flex items-center mr-4">
              <BsFire color="red" />
              <Text size="xLarge" className="mt-2 mb-2  text-red-500 font-bold">
                {product?.discount}%
              </Text>
            </Box>
          </div> */}

          <Title
            size="small"
            className="mt-4 mb-0 ml-1 truncate font-bold text-md"
          >
            {product.name}
          </Title>

          <Box className=" ml-1 flex justify-between items-end">
            <Box className="flex flex-col">
              <Text size="normal" className=" mt-2   text-red-500 font-bold ">
                <DisplayPrice>{product?.costdown || 0}</DisplayPrice>
              </Text>
              <Text className="mt-2 mb-2   text-gray text-sm line-through">
                <DisplayPrice>{product.price.toString()}</DisplayPrice>
              </Text>
            </Box>
            <Box className="flex items-center mr-4 mb-3 bg-red-500 rounded-xl">
              <BiPlus
                color="white"
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              />
            </Box>
          </Box>
        </div>
      )}
    </ProductPicker>
  );
};

export default ProductHotItem;
