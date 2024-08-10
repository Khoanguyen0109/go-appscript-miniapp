import React, { FC, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import logo from "static/logo.jpg";
import styled from "styled-components";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Modal } from "zmp-ui";
import supabase from "../../client/client";
import { EUserVoucherStatus } from "../../constantsapp";
import useCustomSnackbar from "../../hooks/useCustomSnackbar";
import { userPointState, userState } from "../../state";
import { userVouchersState } from "../../state/discount-state";
import { TDiscount } from "../../types/discount";

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
export const VoucherList: FC<TVoucherListProps> = ({
  banners,
  onClick,
  padding,
}) => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectDiscount, setSelectDiscount] = useState<null | TDiscount>(null);
  const { openSnackbar } = useCustomSnackbar();
  const [userVouchers, setUserVouchers] = useRecoilState(userVouchersState);
  const user = useRecoilValue(userState);
  const [userTotalPoint, setUserTotalPoint] = useRecoilState(userPointState);
  const onClickRedeem = (item) => {
    if (userTotalPoint < item.point) {
      return openSnackbar({
        text: "Bạn không đủ điểm cho voucher này!",
        type: "error",
        icon: true,
        duration: 2000,
      });
    }
    setSelectDiscount(item);
    setConfirmModalVisible(true);
  };
  const handleRedeem = async () => {
    if (selectDiscount) {
      try {
        const pointLess = userTotalPoint - selectDiscount.point;

        // const { data: existingVoucher } = await supabase
        //   .from("user_vouchers")
        //   .select()
        //   .eq("userId", user.id)
        //   .eq("discountId", selectDiscount.id)
        //   .single();

        // if (existingVoucher) {
        //   setConfirmModalVisible(false);
        //   setSelectDiscount(null);
        //   return openSnackbar({
        //     text: "Bạn đã đổi voucher này rồi!",
        //     type: "warning",
        //     icon: true,
        //     duration: 2000,
        //   });
        // }

        setUserTotalPoint(pointLess);

        const { data } = await supabase
          .from("user_vouchers")
          .insert({
            userId: user.id,
            discountId: selectDiscount.id,
            status: EUserVoucherStatus.UNUSED,
            thumbnail: selectDiscount.thumbnail,
            discountBy: selectDiscount.discountBy,
            discount: selectDiscount.discount,
          })
          .select("*, discounts(*)");

        if (data?.length) {
          setUserVouchers([...userVouchers, data[0]]);
        }

        await supabase
          .from("users")
          .update({ totalPoint: pointLess })
          .eq("id", user.id);

        setConfirmModalVisible(false);
        setSelectDiscount(null);
        return openSnackbar({
          text: "Bạn đã thu thập cho voucher này!",
          type: "success",
          icon: true,
          duration: 2000,
        });
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  const isAutoPlay = !confirmModalVisible;

  return (
    <Box
      className="bg-white w-full max-h-96"
      pb={padding ?? 0}
      onClick={onClick}
    >
      <StyledSwiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
        }}
        slidesPerView={1}
        spaceBetween={30}
        autoplay={{
          delay: isAutoPlay ? 20000 : 2000,
          waitForTransition: true,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        loop
        cssMode
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={i}>
            <Box
              className="w-full aspect-[2/1] bg-no-repeat bg-center bg-skeleton rounded-xl"
              style={{
                backgroundImage: `url(${banner?.value || banner?.thumbnail})`,
                backgroundSize: "cover",
              }}
              onClick={() => onClickRedeem(banner)}
            />
          </SwiperSlide>
        ))}
      </StyledSwiper>
      <Modal
        visible={confirmModalVisible}
        title="Đổi voucher"
        coverSrc={logo}
        description={`Bạn xác nhận đổi voucher ${selectDiscount?.title}`}
        actions={[
          {
            text: "Huỷ",
            onClick: () => {
              setConfirmModalVisible(false);
              setSelectDiscount(null);
            },
          },
          {
            highLight: true,
            text: "Đồng ý",
            onClick: () => {
              handleRedeem();
            },
          },
        ]}
      />
    </Box>
  );
};
