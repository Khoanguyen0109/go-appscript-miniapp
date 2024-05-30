import { ElasticTextarea } from "components/elastic-textarea";
import { ListRenderer } from "components/list-renderer";
import React, { FC, Suspense, useEffect } from "react";
import { Box, Icon, Input, Text } from "zmp-ui";
import { PersonPicker, RequestPersonPickerPhone } from "./person-picker";
import { RequestStorePickerLocation, StorePicker } from "./store-picker";
import { TimePicker } from "./time-picker";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { addressSelectedState, noteState } from "./state";
import PaymentPicker, { RequestPayment } from "./payment-picker";
import { ROUTES } from "pages/route";
import { ListItem } from "components/list-item";
import { getAddress } from "utils";
import { addressesState } from "pages/user/state";
import { size } from "lodash";
import { userState } from "../../state";
import { ERoles } from "../../constants";

export const Delivery: FC = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [note, setNote] = useRecoilState(noteState);
  const [address, setAddressSelected] = useRecoilState(addressSelectedState);
  // const [customer, setCustomerSelected] = useRecoilState(customerSelectedState);

  const navigateToAddress = () => {
    navigate({
      pathname: ROUTES.USER_ADDRESS,
      search: createSearchParams({
        routeFrom: "cart",
      }).toString(),
    });
  };

  const navigateCTVUserAddress = () => {
    navigate({
      pathname: ROUTES.CTV_USER_LIST,
      search: createSearchParams({
        routeFrom: "cart",
      }).toString(),
    });
  };

  return (
    <Box className="space-y-1 mb-5 ">
      <Text className="text-md font-bold px-2">Hình thức nhận hàng</Text>

      <ListRenderer
        padding={2}
        items={[
          // {
          //   left: <Icon icon="zi-check-circle" className="my-auto" />,
          //   right: (
          //     <Suspense fallback={<RequestPayment />}>
          //       <PaymentPicker />
          //     </Suspense>
          //   ),
          // },

          {
            left: <Icon icon="zi-location" className="my-auto" />,
            right: (
              <Suspense fallback={<RequestPayment />}>
                <ListItem
                  onClick={() =>
                    user.role === ERoles.CTV
                      ? navigateCTVUserAddress()
                      : navigateToAddress()
                  }
                  title={address?.name ?? "Địa chỉ giao hàng"}
                  subtitle={
                    getAddress(address) ?? "Vui lòng chọn địa chỉ giao hàng"
                  }
                />
              </Suspense>
            ),
          },
          {
            left: <Icon icon="zi-note" className="my-auto" />,
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
