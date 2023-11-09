import React, { Suspense } from "react";
import { Box, Page } from "zmp-ui";
import { Inquiry } from "./inquiry";
import { Welcome } from "./welcome";
import { Banner } from "../../components/banner/banner";
import { Categories } from "./categories";
import { Recommend } from "./recommend";
import { ProductList } from "./product-list";
import { Divider } from "components/divider";
import { bannerState } from "./state";
import { useRecoilValue } from "recoil";

const HomePage: React.FunctionComponent = () => {
  const banners = useRecoilValue(bannerState);

  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Welcome />
      <Box className="flex-1 overflow-auto">
        <Inquiry />
        <Banner banners={banners} />
        <Suspense>
          <Categories />
        </Suspense>
        {/* <Divider /> */}
        {/* <Recommend /> */}
        {/* <Divider /> */}
        <ProductList />
        <Divider />
      </Box>
    </Page>
  );
};

export default HomePage;
