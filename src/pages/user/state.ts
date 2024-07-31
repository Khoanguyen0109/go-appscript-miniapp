import axios from "axios";
import { atom, selector } from "recoil";
import { userState } from "state";
import supabase from "../../client/client";

const PROVINCE_API = "https://province-blue.vercel.app/api";
export const provinceState = selector({
  key: "provinces",
  get: async () => {
    const res = await axios(`${PROVINCE_API}/p`);
    return res.data || [];
  },
});
export const selectedProvinceId = atom({
  key: "selectedProvinceId",
  default: "Thành phố Hồ Chí Minh",
});

export const districtState = selector({
  key: "districts",
  get: async ({ get }) => {
    const provinceId = get(selectedProvinceId);
    const provinces = get(provinceState);
    const code = provinces.find((item) => item.name === provinceId)?.code;
    if (provinceId) {
      const res = await axios(`${PROVINCE_API}/p/${code}?depth=2`);
      return res.data.districts;
    }
    return [];
  },
});

export const selectedDistrictId = atom({
  key: "selectedDistrictId",
  default: null,
});

export const wardState = selector({
  key: "wards",
  get: async ({ get }) => {
    const districtId = get(selectedDistrictId);
    const districts = get(districtState);
    const code = districts.find((item) => item.name === districtId)?.code;
    if (!districtId) {
      return [];
    }
    if (!code) {
      return [];
    }
    const res = await axios(`${PROVINCE_API}/d/${code}?depth=2`);
    return res.data.wards;
  },
});

export const selectedWardId = atom({
  key: "selectedWardId",
  default: null,
});

export const addressesState = selector({
  key: "addresses",
  get: async ({ get }) => {
    const { id } = get(userState);
    const { data, error } = await supabase
      .from("user_addresses")
      .select()
      .eq("userId", id);
    return data;
  },
});

export const addressDetailSelected = atom({
  key: "addressDetailSelected",
  default: null,
});
