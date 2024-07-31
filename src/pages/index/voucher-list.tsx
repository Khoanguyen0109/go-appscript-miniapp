import React, { FC, Suspense, useRef } from "react";
import { Section } from "components/section";
import { useRecoilValue } from "recoil";
import { bannerState } from "./state";
import { Box } from "zmp-ui";
import { ImageSkeleton } from "components/skeletons";
import { VoucherList } from "../../components/voucher-list/voucher-list";
import { ROUTES } from "../route";
import {userState} from "../../state";
import {ERoles} from "../../constants";

export const VoucherHomeContent: FC = () => {
  const errorRef = useRef(null);
  const banners = useRecoilValue(bannerState);

  if (banners.length <= 0) {
    return <></>;
  }
  return (
    <Section
      title="Voucher"
      mt={1}
      rightText={"Xem tất cả"}
      rightTo={ROUTES.BUY_VOUCHER}
    >
      <Box ref={errorRef} className="">
        <VoucherList banners={banners} />
      </Box>
    </Section>
  );
};

export const VoucherHomeFallback: FC = () => {
  return (
    <Section title="Vouchers">
      <Box className="w-full">
        <ImageSkeleton className="w-full" />
      </Box>
    </Section>
  );
};

const VoucherHome: FC = () => {
  const user = useRecoilValue(userState);
  if (user.role !== ERoles.COB){
    return <></>
  }
  return (
    <Suspense fallback={<VoucherHomeFallback />}>
      <VoucherHomeContent />
    </Suspense>
  );
};
export default VoucherHome;
