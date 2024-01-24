import React, { useEffect } from "react";
import { Box, Page } from "zmp-ui";
import { Welcome } from "./welcome";

import { ProductList } from "./product-list";
import { Divider } from "components/divider";

import BannerHome from "./banner";
import ProductHotItemList from "./product-hot-item-list";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import { axiosInstance } from "api/instance";
import { Categories } from "./categories";

const HomePage: React.FunctionComponent = () => {
  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Welcome />
      <Box className="flex-1 overflow-auto mt-4">
        <BannerHome />
        <Categories />

        <ProductHotItemList />
        <ProductList />
        <Divider />
      </Box>
    </Page>
  );
};

export default HomePage;
