import useCustomSnackbar from "hooks/useCustomSnackbar";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { discountState } from "state";
import { Box, Button, Input, Text, useSnackbar } from "zmp-ui";
import supabase from "../../client/client";

type Props = {};

function Discount({}: Props) {
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useRecoilState(discountState);
  console.log(discount)
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    const { value } = e.target;
    if (!value) {
      setDiscount(null);
      1;
    }
    setVoucher(value);
  };
  const { openSnackbar } = useCustomSnackbar();

  const onSubmitVoucher = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("discounts")
        .select()
        .eq("voucher", voucher);
      if (data?.length > 0) {
        setDiscount(data[0]);
        openSnackbar({
          text: "Mã giảm giá đã áp dụng",
          type: "success",
          icon: true,
          duration: 2000,
        });
        return data[0];
      }
    } catch (error) {
      setDiscount(null);

      return openSnackbar({
        text: "Mã giảm giá sai hoặc hết hạn",
        type: "error",
        icon: true,
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box className="px-2 ">
      <Text className="text-md font-bold mb-1">Mã khuyến mãi</Text>
      <Box className="flex items-center justify-between">
        <Input
          size="small"
          placeholder="Nhập voucher giảm giá"
          className=" w-52 mr-2"
          value={voucher}
          onChange={onChange}
        ></Input>
        <Button
          loading={loading}
          disabled={!voucher}
          size="small"
          className="w-24"
          onClick={onSubmitVoucher}
        >
          Áp dụng
        </Button>
      </Box>
    </Box>
  );
}

export default Discount;
