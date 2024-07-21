import {ElasticTextarea} from "components/elastic-textarea";
import {ListRenderer} from "components/list-renderer";
import React, {FC, Suspense} from "react";
import {Box, Icon, Text} from "zmp-ui";

import {createSearchParams, useNavigate} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {addressSelectedState, noteState} from "./state";
import {ROUTES} from "pages/route";
import {ListItem} from "components/list-item";
import {getAddress} from "utils";

import {discountState, userState} from "../../state";

export const Delivery: FC = () => {
  const navigate = useNavigate();
  const [note, setNote] = useRecoilState(noteState);
  const [address, setAddressSelected] = useRecoilState(addressSelectedState);
  const discount = useRecoilValue(discountState);
  const user = useRecoilValue(userState);
  const isShowVoucher = user?.role === "CTV" || user?.role === "Khách hàng";

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
            left: <Icon icon="zi-location" className="my-auto"/>,
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

          isShowVoucher && {
            left: <Icon icon="zi-check-circle" className="my-auto"/>,
            right: (
              <ListItem
                onClick={() => navigateFromCart(ROUTES.USER_VOUCHER)}
                title={"Voucher"}
                subtitle={discount?.title || "Sử dụng voucher giảm giá"}
              />
            ),
          },
          {
            left: <Icon icon="zi-note" className="my-auto"/>,
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
