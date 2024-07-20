import React, { FC, useState } from "react";
import styled from "styled-components";
import { Autoplay, FreeMode, Navigation, Pagination, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box } from "zmp-ui";
import "swiper/css/navigation";

type TBannerProduct = {
  image: string;
};

type TBannerProductProps = {
  banners: TBannerProduct[];
  onClick?: () => void;
  padding?: number;
};
const StyledSwiper = styled(Swiper)`
  .swiper-button-next:after,
  .swiper-rtl .swiper-button-prev:after {
    padding: 7px;
    color: black;
    font-size: 20px;
    background: white;
    border-radius: 10px;
    content: "next";
  }

  .swiper-button-prev:after,
  .swiper-rtl .swiper-button-next:after {
    padding: 7px;
    color: black;
    font-size: 20px;
    background: white;
    border-radius: 10px;
    content: "prev";
  }
`;
export const BannerProduct: FC<TBannerProductProps> = ({
  banners,
  onClick,
  padding,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <Box className="bg-white w-full px-2" pb={padding ?? 0}>
      <StyledSwiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Pagination, Autoplay, Navigation, Thumbs]}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        autoplay
        loop
        cssMode
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={i}>
            <Box
              className="px-2 w-full rounded-xl aspect-[2/1] bg-no-repeat bg-center"
              style={{
                backgroundImage: `url(${banner?.value || banner?.image})`,
                backgroundSize: "cover",
              }}
              onClick={onClick}
            />
          </SwiperSlide>
        ))}
      </StyledSwiper>
      <Swiper
        onSwiper={setThumbsSwiper as any}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation]}
        className="mt-2"
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={i}>
            <Box
              className="w-full aspect-[2/1] bg-no-repeat bg-center rounded-md"
              style={{
                backgroundImage: `url(${banner?.value || banner?.image})`,
                backgroundSize: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
