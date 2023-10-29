import { axiosInstance } from "api/instance";
import { selector } from "recoil";

export const bannerState = selector({
  key: "banner",
  get: async () => {
    try {
      const res = await axiosInstance.get("/banners");
      return res.data?.data || [];
    } catch (error) {
      console.log("error", error);
    }
  },
});
