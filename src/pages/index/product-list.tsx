import { Section } from "components/section";
import { ProductItemSkeleton } from "components/skeletons";
import React, { FC, Suspense, useRef } from "react";
import { useRecoilValue } from "recoil";
import { productsState } from "state";
import { Grid } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box } from "zmp-ui";
import NewProductItem from "./new-product-item";
import "swiper/css";
import styled from "styled-components";

const StyledSwiper = styled(Swiper)`
  .swiper-grid-column > .swiper-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: 1fr 1fr;
  }

  .swiper-wrapper {
    flex-direction: unset;
    flex-wrap: wrap;
  }
`;
export const ProductListContent: FC = () => {
  const errorRef = useRef(null);

  const products = useRecoilValue(productsState);

  if (products.length <= 0) {
    return <></>;
  }
  return (
    <Section
      title="Danh sách sản phẩm"
      mt={1}
      rightText={"Xem tất cả"}
      rightTo={'/all-products'}
    >
      <Box ref={errorRef} className="">
        <StyledSwiper
          slidesPerView={2.1}
          grid={{
            rows: 2,
            fill: "row",
          }}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          modules={[Grid]}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <NewProductItem product={product} />
            </SwiperSlide>
          ))}
        </StyledSwiper>
      </Box>
    </Section>
  );
};

export const ProductListFallback: FC = () => {
  const products = [...new Array(12)];

  return (
    <Section title="Danh sách sản phẩm">
      <Box className="grid grid-cols-2 gap-4">
        {products.map((_, i) => (
          <ProductItemSkeleton key={i} />
        ))}
      </Box>
    </Section>
  );
};

export const ProductList: FC = () => {
  return (
    <Suspense fallback={<ProductListFallback />}>
      <ProductListContent />
    </Suspense>
  );
};
