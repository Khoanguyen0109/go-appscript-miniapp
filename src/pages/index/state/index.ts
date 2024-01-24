import { axiosInstance } from "api/instance";
import { selector } from "recoil";
import { settingState } from "state";

export const bannerState = selector({
  key: "banner",
  get: ({ get }) => {
    const setting = get(settingState);
    return setting.filter((item) => item.type === "panel");
  },
});

export const scoreRankState = selector({
  key: "scoreRank",
  get: ({ get }) => {
    const setting = get(settingState);
    return setting.filter((item) => item.type === "score");
  },
});
