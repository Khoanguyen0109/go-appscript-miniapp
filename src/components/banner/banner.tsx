import React, { FC } from "react";
import styled from "styled-components";
import { Autoplay, Pagination, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box } from "zmp-ui";

type TBanner = {
  image: string;
};

type TBannerProps = {
  banners: TBanner[];
  onClick?: () => void;
  padding?: number;
};
const StyledSwiper = styled(Swiper)`
  .swiper-slide {
    width: 80%;
  }

  .swiper-wrapper {
    padding-bottom: 30px;
  }

  .swiper-container-horizontal > .swiper-pagination-bullets,
  .swiper-pagination-custom,
  .swiper-pagination-fraction {
    bottom: 0px !important;
  }

  .swiper-pagination.swiper-pagination-horizontal
    > .swiper-pagination-bullet.swiper-pagination-bullet-active {
    width: 12px;
    background-color: #1c472e;
    border-radius: 10px;
  }

  .swiper-pagination.swiper-pagination-horizontal > .swiper-pagination-bullet {
    width: 7px;
    height: 7px;
    background-color: var(--swiper-pagination-bullet-inactive-color, #000);
  }

  .swiper-pagination.swiper-pagination-horizontal {
    background-color: #fff;
  }
`;
export const Banner: FC<TBannerProps> = ({ banners, onClick, padding }) => {
  return (
    <Box className="bg-white w-full px-2" pb={padding ?? 0} onClick={onClick}>
      <StyledSwiper
        slidesPerView={1}
        spaceBetween={30}
        modules={[Pagination, Autoplay, Thumbs]}
        pagination={{
          clickable: true,
        }}
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
            />
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </Box>
  );
};
