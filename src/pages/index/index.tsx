import React from "react";
import { Box, Page } from "zmp-ui";
import { Welcome } from "./welcome";

import { ProductList } from "./product-list";
import { Divider } from "components/divider";

import BannerHome from "./banner";
import ProductHotItemList from "./product-hot-item-list";
import { Categories } from "./categories";
import { useRecoilValueLoadable } from "recoil";
import { globalProductInventoriesSelector } from "../../state";
import DiscountPanel from "./discount-panel";

const HomePage: React.FunctionComponent = () => {
  useRecoilValueLoadable(globalProductInventoriesSelector);
  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Welcome />
      <Box className="flex-1 overflow-auto mt-2">
        <BannerHome />
        <Categories />
        <DiscountPanel />
        <ProductHotItemList />
        <ProductList />
        <Divider />
      </Box>
    </Page>
  );
};

export default HomePage;
