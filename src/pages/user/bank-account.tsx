import React from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { Box, Button, Header, Page } from "zmp-ui";
import { userState } from "../../state";
import supabase from "../../client/client";
import AppInput from "../../components/customize/Input";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../route";

type Props = {};

function BankAccount({}: Props) {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      bank: user?.bank || "",
      bankAccount: user?.bankAccount || "",
    },
  });

  const onSubmit = async (value) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ ...value })
        .eq("id", user.id);
      console.log("error", error);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Page>
      <Header
        title="Tài khoản"
        showBackIcon={true}
        onBackClick={() => navigate(ROUTES.INCOME)}
      />

      <form className="p-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <AppInput
            placeholder={`Nhập tên ngân hàng`}
            label="Ngân hàng"
            {...register("bank", { required: true })}
          />
        </Box>
        <Box mt={4}>
          <AppInput
            placeholder={`Nhập số tài khoản`}
            label="Số tài khoản"
            {...register("bankAccount", { required: true })}
          />
        </Box>
        <Button
          loading={isSubmitting}
          htmlType="submit"
          className="w-full mt-8"
        >
          Cập nhật
        </Button>
      </form>
    </Page>
  );
}

export default BankAccount;
