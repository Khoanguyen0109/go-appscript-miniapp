import React, { Suspense } from "react";
import { bannerState } from "./state";
import { useRecoilValue } from "recoil";
import { Banner } from "components/banner/banner";
import { ImageSkeleton } from "components/skeletons";

type Props = {};

function BannerHome({}: Props) {
  const banners = useRecoilValue(bannerState);

  return (
    <Suspense fallback={<ImageSkeleton className="w-full  rounded-lg" />}>
      <Banner banners={banners} />
    </Suspense>
  );
}

export default BannerHome;
