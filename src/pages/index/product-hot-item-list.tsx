import React, { Suspense } from "react";
import { BsFire } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import { hotProductsState } from "state";
import { Box, Text } from "zmp-ui";
import ProductHotItem from "./product-hot-item";

function ProductHotItemList() {
  const hotProducts = useRecoilValue(hotProductsState);

  return (
    <Suspense>
      <>
        <Box mx={4} mt={6} className="flex">
          <Text className="font-bold text-lg">Sản phẩm Hot</Text>
          <BsFire color="red" size={24} />
        </Box>

        <div className="overflow-auto snap-x snap-mandatory scroll-p-4 no-scrollbar h-56">
          <Box m={0} pr={4} flex className="w-max">
            {hotProducts.map((product) => (
              <Box
                key={product.id}
                ml={4}
                mr={0}
                className="snap-start"
                style={{ width: "calc(100vw - 120px)" }}
              >
                <ProductHotItem product={product} />
              </Box>
            ))}
          </Box>
        </div>
      </>
    </Suspense>
  );
}

export default ProductHotItemList;
