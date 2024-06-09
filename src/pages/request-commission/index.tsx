import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Header, Page, Text } from "zmp-ui";
import supabase from "../../client/client";
import AppInput from "../../components/customize/Input";
import { DisplayCoin } from "../../components/display/display-coin";
import {
  userCheckedPointState,
  userState,
  userUncheckedPointState,
} from "../../state";
import { useRecoilState, useRecoilValue } from "recoil";
import { ECommissionRequest } from "../../constants";
import { ctvIncomeListRequestState } from "../../state/ctv-state";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../route";

type Props = {};

function RequestCommission({}: Props) {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [userCheckedPoint, setUserCheckedPoint] = useRecoilState(
    userCheckedPointState
  );
  const [userUncheckedPoint, setUserUncheckedPoint] = useRecoilState(
    userUncheckedPointState
  );
  const [commissionRequest, setCommissionRequest] = useRecoilState(
    ctvIncomeListRequestState
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      total: "",
    },
  });

  const onSubmit = async (value) => {
    try {
      const [{ data: commissionRequest }] = await Promise.all([
        supabase
          .from("commission_requests")
          .insert({
            userId: user.id,
            total: value.total,
            status: ECommissionRequest.WAITING,
          })
          .select(),
        await supabase
          .from("users")
          .update({
            checkedPoint: userCheckedPoint + Number(value.total),
            uncheckedPoint: userUncheckedPoint - Number(value.total),
          })
          .eq("id", user.id),
      ]);
      if (commissionRequest?.length) {
        setCommissionRequest((pre) => [...pre, commissionRequest[0]]);
        setUserCheckedPoint(userCheckedPoint + value.total);
        setUserUncheckedPoint(userUncheckedPoint - value.total);
      }

      if (!user.bank) {
        return navigate(ROUTES.BANK_ACCOUNT);
      }
      return navigate(ROUTES.INCOME);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Page className="bg-white">
      <Header title="Yêu cầu rút xu" showBackIcon={true} />

      <form className="p-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <AppInput
            type="number"
            max={userUncheckedPoint}
            placeholder={`Số xu cần rút`}
            label="Số xu cần rút"
            {...register("total", { required: true })}
          />
        </Box>
        <Box className="mt-3">
          <Text className="text-sm text-green, font-bold">
            Bạn có thể rút <DisplayCoin>{userUncheckedPoint || 0}</DisplayCoin>
          </Text>
        </Box>
        {/* <Box mt={4}>
          <AppInput
            placeholder={`Nhập số tài khoản`}
            label="Số tài khoản"
            {...register("bankAccount", { required: true })}
          />
        </Box> */}
        <Button
          loading={isSubmitting}
          htmlType="submit"
          className="w-full mt-8"
        >
          Gửi
        </Button>
      </form>
    </Page>
  );
}

export default RequestCommission;
