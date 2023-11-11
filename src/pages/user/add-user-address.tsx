import { Divider } from "components/divider";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { Box, Button, Header, Icon, Page, Select } from "zmp-ui";
import {
  addressesState,
  districtState,
  provinceState,
  selectedDistrictId,
  selectedProvinceId,
  selectedWardId,
  wardState,
} from "./state";
import AppInput from "components/customize/Input";
import ErrorText from "components/customize/ErrorText";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "pages/route";
import { axiosInstance } from "api/instance";
import { userState } from "state";
import { addressSelectedState } from "pages/cart/state";
const { OtpGroup, Option } = Select;

type Props = {};

function AddUserAddress({}: Props) {
  const navigate = useNavigate();
  const provinces = useRecoilValue(provinceState);
  const setProvinceId = useSetRecoilState(selectedProvinceId);
  const districts = useRecoilValue(districtState);
  const setDistrictId = useSetRecoilState(selectedDistrictId);
  const wards = useRecoilValue(wardState);
  const setWardId = useSetRecoilState(selectedWardId);
  const refresh = useRecoilRefresher_UNSTABLE(addressesState);
  const user = useRecoilValue(userState);
  const [addressSelected, setAddressSelected] =
    useRecoilState(addressSelectedState);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: addressSelected || { type: 'home'} });
  const onSubmit = async (value) => {
    console.log('value', value)
    try {
      setLoading(true);
      const res = await axiosInstance.post(`users/${user.id}/address`, {
        ...value,
      });
      refresh();
      navigate(ROUTES.USER_ADDRESS);
    } catch (error) {
      console.log('error', error)
    }
  };

  const getFieldName = (field: string) => {
    switch (field) {
      case "address":
        return "Địa chỉ";
      case "province":
        return "Tỉnh/Thành phố";
      case "district":
        return "Quận/Huyện";
      case "ward":
        return "Phường/Xã";
      case "phone":
        return "Số điện thoại";
      case "name":
        return "Tên người nhận";
      case "type":
        return "Loại";
      default:
        return "";
    }
  };

  const getErrorMessage = (field: string) => {
    if (errors[field]) {
      const name = getFieldName(field);
      if (errors[field]?.type === "required")
        return `${name} không được để trống`;
      return `${name} không hợp lệ`;
    }
    return "";
  };
  return (
    <Page>
      <Header title="Thêm địa chỉ" showBackIcon={true} />

      <form className="p-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <AppInput
            placeholder={`Nhập ${getFieldName("phone")} `}
            label={getFieldName("phone")}
            type="number"
            errorText={getErrorMessage("phone")}
            {...register("phone", { required: true })}
            status={errors?.phone ? "error" : "default"}
          />
        </Box>
        <Box mt={4}>
          <AppInput
            placeholder={`Nhập ${getFieldName("name")} `}
            label={getFieldName("name")}
            errorText={getErrorMessage("name")}
            {...register("name", { required: true })}
            status={errors?.name ? "error" : "default"}
          />
        </Box>
        <Box mt={4}>
          <AppInput
            label={getFieldName("address")}
            placeholder={`Nhập ${getFieldName("address")} `}
            errorText={getErrorMessage("address")}
            {...register("address", { required: true })}
            status={errors?.address ? "error" : "default"}
          />
        </Box>
        <Box mt={4}>
          <Select
            value={addressSelected?.type}
            label={getFieldName("type")}
            defaultValue="home"
            {...register("type", { required: true })}
            onChange={(value) => {
              setValue("type", value, { shouldValidate: true });
            }}
            closeOnSelect={true}
          >
            <Option value="home" title="Nhà" />
            <Option value="work" title="Văn phòng" />
          </Select>
          <ErrorText
            show={Boolean(errors?.type)}
            errorText={getErrorMessage("type")}
          />
        </Box>
        <Box mt={4}>
          <Select
            value={addressSelected?.province}
            label={getFieldName("province")}
            placeholder={`Nhập ${getFieldName("province")} `}
            defaultValue=""
            {...register("province", { required: true })}
            onChange={(value) => {
              setProvinceId(value);

              setValue("province", value, { shouldValidate: true });
            }}
            closeOnSelect={true}
          >
            {addressSelected && provinces.length === 0 && (
              <Option
                value={addressSelected.province}
                title={addressSelected.province}
              />
            )}
            <Option value="" title="" disabled />
            {provinces.map((item) => (
              <Option value={item.name} title={item.name} />
            ))}
          </Select>
          <ErrorText
            show={Boolean(errors?.province)}
            errorText={getErrorMessage("province")}
          />
        </Box>
        <Box mt={4}>
          <Select
            value={addressSelected?.district}
            label={getFieldName("district")}
            placeholder={`Nhập ${getFieldName("district")} `}
            defaultValue=""
            closeOnSelect={true}
            {...register("district", { required: true })}
            onChange={(value) => {
              setDistrictId(value);
              setValue("district", value, { shouldValidate: true });
            }}
          >
            <Option value="" title="" disabled />
            {districts.map((item) => (
              <Option value={item.name} title={item.name} />
            ))}
          </Select>
          <ErrorText
            show={Boolean(errors?.district)}
            errorText={getErrorMessage("district")}
          />
        </Box>
        <Box mt={4}>
          <Select
            value={addressSelected?.ward}
            label={getFieldName("ward")}
            placeholder={`Nhập ${getFieldName("ward")} `}
            defaultValue=""
            closeOnSelect={true}
            {...register("ward", { required: true })}
            onChange={(value) => {
              setWardId(value);
              setValue("ward", value, { shouldValidate: true });
            }}
          >
            <Option value="" title="" disabled />
            {wards.map((item) => (
              <Option value={item.name} title={item.name} />
            ))}
          </Select>
          <ErrorText
            show={Boolean(errors?.ward)}
            errorText={getErrorMessage("ward")}
          />
        </Box>

        <Box className="m-8">
          <Divider />
        </Box>

        <Button
          loading={loading}
          htmlType="submit"
          // className="w-full"
          suffixIcon={<Icon icon="zi-add-user" />}
        >
          {addressSelected ? "Cập nhật địa chỉ" : " Thêm địa chỉ"}
        </Button>
      </form>
    </Page>
  );
}

export default AddUserAddress;
