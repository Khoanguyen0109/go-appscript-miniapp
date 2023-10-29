import React, { FC } from "react";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box } from "zmp-ui";

type TBanner = {
  image: string;
};

type TBannerProps = {
  banners: TBanner[];
};
export const Banner: FC<TBannerProps> = ({ banners }) => {
  return (
    <Box className="bg-white" pb={4}>
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        autoplay
        loop
        cssMode
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={i} className="px-4">
            <Box
              className="w-full rounded-lg aspect-[2/1] bg-cover bg-center bg-skeleton"
              style={{ backgroundImage: `url(${banner.image})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
