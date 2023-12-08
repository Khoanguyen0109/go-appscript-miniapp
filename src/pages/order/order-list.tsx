import React, { useEffect, useRef, useState } from "react";
import { Box, Icon, Input, List, Modal, Text, useSnackbar } from "zmp-ui";
import OrderItem from "./order-item";
import { TOrder } from "types/order";
import { axiosInstance } from "api/instance";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import ReactStars from "react-rating-stars-component";
const { Item } = List;

type Props = {
  orders: TOrder[];
};

const SVGIcon = (props) => (
  <svg className={props.className} pointerEvents="none">
    <use xlinkHref={props.href} />
  </svg>
);

function OrderList({ orders }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [note, setNote] = useState("");
  const [rating, setRating] = useState();
  const user = useRecoilValue(userState);
  const [orderSelected, setOrderSelected] = useState();
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
  const timmerId = useRef();
  console.log("rating", rating);
  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );
  const onOpenRating = (id) => {
    setOpenModal(true);
    setOrderSelected(id);
  };
  const submitRating = async () => {
    const res = await axiosInstance.put(
      `orders/${user.id}/rating/${orderSelected}`,
      {
        rating,
      }
    );
    setNote("");
    setOrderSelected(undefined);
    setOpenModal(false);
    return openSnackbar({
      text: "Đánh giá của bạn đã được gửi",
      type: "success",
      icon: true,
      duration: 1000,
    });
  };
  const onChange = (e) => {
    setNote(e.target.value);
  };

  if (orders.length === 0) {
    return (
      <Box className="text-center">
        <Text
          className="bg-background rounded-xl py-8 px-4 text-center text-gray"
          size="xxSmall"
        >
          Không có đơn hàng
        </Text>
        <Icon size={40} icon="zi-bookmark-delete"></Icon>
      </Box>
    );
  }

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  return (
    <Box className="bg-devider_1 min-h-screen overflow-y-auto">
      {orders.map((item) => (
        <OrderItem key={item.id} item={item} onOpenRating={onOpenRating} />
      ))}

      <Modal
        visible={openModal}
        title="Liện hệ & góp ý"
        actions={[
          {
            text: "Huỷ",
            onClick: () => {
              setRating(undefined);
              setNote("");
              setOpenModal(false);
            },
          },
          {
            text: "Gửi",
            onClick: () => submitRating(),
            highLight: true,
          },
        ]}
      >
        {/* <Select
          value={issue}
          placeholder="Vấn đề cần góp ý"
          onChange={(value) => setIssue(value)}
          closeOnSelect
        >
          <Option value="Vấn đề về đơn hàng" title="Vấn đề về đơn hàng" />
          <Option value="Vấn đề về sản phẩm" title="Vấn đề về sản phẩm" />
          <Option value="Vấn đề về dịch vụ" title="Vấn đề về dịch vụ" />
          <Option value="Khác" title="Khác" />
        </Select> */}
        <Box className="mt-4  flex justify-center">
          <ReactStars
            count={5}
            onChange={ratingChanged}
            size={32}
            activeColor="#ffd700"
          />
        </Box>

        <Box className="mb-3" />
        <Input.TextArea
          helperText="Nội dung góp ý"
          value={note}
          onChange={onChange}
        />
      </Modal>
    </Box>
  );
}

export default OrderList;
