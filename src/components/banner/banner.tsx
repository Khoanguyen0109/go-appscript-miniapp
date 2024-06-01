import React, { FC } from "react";
import { Autoplay, Pagination } from "swiper";
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
    <Box className="bg-white w-full" pb={padding ?? 0} onClick={onClick}>
      <Swiper
        modules={[Pagination, Autoplay]}
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
              className="w-full aspect-[2/1] bg-no-repeat bg-center bg-skeleton"
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
