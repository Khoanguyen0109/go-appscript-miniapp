import React from "react";
import { useRecoilValue } from "recoil";
import { Autoplay, EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box } from "zmp-ui";
import { discountBannersSelector } from "../../state/discount-state";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../route";

type Props = {};

function DiscountPanel({}: Props) {
  const navigate = useNavigate();
  const discounts = useRecoilValue(discountBannersSelector);
  console.log("discounts", discounts);
  const onClick = () => {
    return navigate(ROUTES.BUY_VOUCHER);
  };
  return (
    <Box className="bg-white w-full mt-3" onClick={onClick}>
      <Swiper
        modules={[Pagination, Autoplay, EffectCoverflow]}
        pagination={{
          clickable: true,
        }}
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 30,
          stretch: 10,
          depth: 50,
          modifier: 1,
          slideShadows: true,
        }}
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={12}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
      >
        {discounts.map((discount, i) => (
          <SwiperSlide key={i}>
            <Box
              className="w-full h-24 bg-no-repeat bg-center bg-skeleton rounded-md"
              style={{
                backgroundImage: `url(${discount.panel})`,
                backgroundSize: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default DiscountPanel;
