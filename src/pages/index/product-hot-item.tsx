import React from "react";
import { FunctionComponent } from "react";
import { Box, Button, Icon, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { Product } from "types/product";
import { ROUTES } from "pages/route";
import { BsFire } from "react-icons/bs";
import { DisplayPrice } from "components/display/price";

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
  const viewDetail = () => {
    navigate(ROUTES.PRODUCT_DETAIL(product.id));
  };
  console.log("product", product);
  return (
    <div
      onClick={onClick ?? viewDetail}
      className="relative bg-white mt-3 rounded-xl overflow-hidden p-0 restaurant-with-cover shadow-md"
    >
      <div className="aspect-cinema relative h-24 w-full">
        <img
          src={product.image}
          className="absolute w-full h-full object-contain"
        />
      </div>
      <div className="absolute left-3 top-3 py-1 px-3 space-x-1 flex items-center font-semibold text-sm text-white bg-primary rounded-full">
        <Icon icon="zi-star-solid" className="text-yellow-400" size={16} />
        <span>{product.rating}</span>
      </div>
      {/* <div className="absolute right-1 top-1 bg-yellow-200  space-x-1 flex items-center font-semibold text-sm text-white  ">

      </div> */}

      <Title size="small" className="mt-2 mb-0 mx-4 truncate">
        {product.name}
      </Title>

      <Box className=" flex justify-between items-center">
        <Box className="flex justify-start">
          <Text
            size="medium"
            className="mt-2 mb-2 ml-4 mr-2  text-center text-red-500 font-bold underline"
          >
            <DisplayPrice>{product.costdown}</DisplayPrice>
          </Text>
          <Text className="mt-2 mb-2  text-center text-gray text-sm line-through">
            <DisplayPrice>{product.price.toString()}</DisplayPrice>
          </Text>
        </Box>
        <Box className="flex items-center mr-4">
          <BsFire color="red" />
          <Text size="large" className="mt-2 mb-2  text-red-500 font-bold">
            {product.discount}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default ProductHotItem;
