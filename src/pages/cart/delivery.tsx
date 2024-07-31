import { ElasticTextarea } from "components/elastic-textarea";
import { ListItem } from "components/list-item";
import { ListRenderer } from "components/list-renderer";
import { ROUTES } from "pages/route";
import React, { FC, Suspense } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { getAddress } from "utils";
import { Box, Icon, Text } from "zmp-ui";
import { ERoles } from "../../constants";
import { discountState, userState } from "../../state";
import locationIcon from "../../static/icons/location.svg";
import noteIcon from "../../static/icons/note.svg";
import voucherIcon from "../../static/icons/voucher.svg";
import { addressSelectedState, noteState } from "./state";

export const Delivery: FC<{ isShowVoucher?: boolean }> = ({
  isShowVoucher = true,
}) => {
  const navigate = useNavigate();
  const [note, setNote] = useRecoilState(noteState);
  const [address, setAddressSelected] = useRecoilState(addressSelectedState);
  const discount = useRecoilValue(discountState);
  const user = useRecoilValue(userState);
  const showVoucherBasedOnRole =
    (user?.role === ERoles.CTV || user?.role === ERoles.USER) && isShowVoucher;

  const navigateFromCart = (route) => {
    navigate({
      pathname: route,
      search: createSearchParams({
        routeFrom: "cart",
      }).toString(),
    });
  };

  return (
    <Box className="space-y-1 mb-3 ">
      <Text className="text-md font-bold px-2">Hình thức nhận hàng</Text>

      <ListRenderer
        padding={2}
        items={[
          {
            left: (
              <img src={locationIcon} className="my-auto" alt={"location"} />
            ),
            right: (
              <Suspense>
                <ListItem
                  onClick={() => navigateFromCart(ROUTES.USER_ADDRESS)}
                  title={address?.name ?? "Địa chỉ giao hàng"}
                  subtitle={
                    getAddress(address) ?? "Vui lòng chọn địa chỉ giao hàng"
                  }
                />
              </Suspense>
            ),
          },

          showVoucherBasedOnRole && {
            left: <img src={voucherIcon} className="my-auto" alt={"voucher"} />,
            right: (
              <ListItem
                onClick={() => navigateFromCart(ROUTES.USER_VOUCHER)}
                title={"Voucher"}
                subtitle={discount?.title || "Sử dụng voucher giảm giá"}
              />
            ),
          },
          {
            left: <img src={noteIcon} className="my-auto" alt={"voucher"} />,
            right: (
              <Box flex>
                <ElasticTextarea
                  placeholder="Nhập ghi chú..."
                  className="border-none px-0 w-full focus:outline-none"
                  maxRows={4}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Box>
            ),
          },
        ]}
        limit={4}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};
