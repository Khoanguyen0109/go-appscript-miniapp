import { axiosInstance } from "api/instance";
import axios from "axios";
import { atom, selector } from "recoil";
import { userState } from "state";

export const provinceState = selector({
  key: "provinces",
  get: async () => {
    const res = await axios(`https://provinces.open-api.vn/api/p/`);
    return res.data || [];
  },
});
export const selectedProvinceId = atom({
  key: "selectedProvinceId",
  default: null,
});

export const districtState = selector({
  key: "districts",
  get: async ({ get }) => {
    const provinceId = get(selectedProvinceId);
    const provinces = get(provinceState);
    const code = provinces.find((item) => item.name === provinceId)?.code;
    if (provinceId) {
      const res = await axios(
        `https://provinces.open-api.vn/api/p/${code}?depth=2`
      );
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
    const res = await axios(
      `https://provinces.open-api.vn/api/d/${code}?depth=2`
    );
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
    const res = await axiosInstance.get(`users/${id}/address`);
    return res.data.data;
  },
});

export const addressDetailSelected = atom({
  key: "addressDetailSelected",
  default: null,
});
