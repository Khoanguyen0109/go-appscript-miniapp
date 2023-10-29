import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getDummyImage } from "utils/product";
import { Box } from "zmp-ui";
import { bannerState } from "./state";

export const Banner: FC = () => {
  const banner = useRecoilValue(bannerState)
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
        {banner
          .map((banner, i) => (
            <SwiperSlide key={i} className="px-4">
              <Box
                className="w-full rounded-lg aspect-[2/1] bg-cover bg-center bg-skeleton"
                style={{ backgroundImage: `url(${banner.link})` }}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </Box>
  );
};
