import React, {FC} from "react";
import {Autoplay, Pagination} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import {Box} from "zmp-ui";
import styled from 'styled-components';

type TVoucherList = {
  image: string;
};

type TVoucherListProps = {
  banners: TVoucherList[];
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

    .swiper-container-horizontal > .swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction {
        bottom: 0px !important;
    }

    .swiper-pagination.swiper-pagination-horizontal > .swiper-pagination-bullet.swiper-pagination-bullet-active {
        width: 12px;
        background-color: #1C472E;
        border-radius: 10px;
    }

    .swiper-pagination.swiper-pagination-horizontal > .swiper-pagination-bullet {
        background-color: var(--swiper-pagination-bullet-inactive-color, #000);
        width: 7px;
        height: 7px;
    }

    .swiper-pagination.swiper-pagination-horizontal {
        background-color: #fff;
    }
`;
export const VoucherList: FC<TVoucherListProps> = ({banners, onClick, padding}) => {
  return (
    <Box className="bg-white w-full max-h-96" pb={padding ?? 0} onClick={onClick}>
      <StyledSwiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
        }}
        slidesPerView={1.25}
        spaceBetween={30}
        autoplay
        loop
        cssMode
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={i}>
            <Box
              className="w-full aspect-[2/1] bg-no-repeat bg-center bg-skeleton rounded-xl"
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
