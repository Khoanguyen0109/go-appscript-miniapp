import React, { FC } from "react";
import { Pagination } from "swiper";
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
export const Banner: FC<TBannerProps> = ({ banners, onClick, padding }) => {
  return (
    <Box className="bg-white w-full" pb={padding ?? 2} onClick={onClick}>
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
              className="w-full rounded-xl aspect-[2/1] bg-no-repeat bg-center bg-skeleton"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: "contain",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
