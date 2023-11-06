import { ListRenderer } from "components/list-renderer";
import { ROUTES } from "pages/route";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, Button, Header, Icon, Page, Text } from "zmp-ui";
import { addressesState } from "./state";
import { addressSelectedState } from "pages/cart/state";
import { getAddress } from "utils";

type Props = {};

function UserAddress({}: Props) {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  console.log("searchParams", searchParams.get("routeFrom"));
  const isRouteFromCart = searchParams.get("routeFrom") === "cart";
  const addresses = useRecoilValue(addressesState);
  const [addressCart, setAddressSelectedCart] =
    useRecoilState(addressSelectedState);
  const [addressSelected, setAddressSelected] =
    useRecoilState(addressSelectedState);

  const onclickAddress = (item) => {
    if (isRouteFromCart) {
      setAddressSelectedCart(item);
      navigate(-1);
    } else {
      setAddressSelected(item);
      navigate(ROUTES.USER_ADDRESS_ADD);
    }
  };
  return (
    <Page>
      <Header title="Danh sách địa chỉ" showBackIcon={true} />
      <Box className="flex justify-end m-4">
        <Button size="medium" onClick={() => navigate(ROUTES.USER_ADDRESS_ADD)}>
          Thêm địa chỉ
        </Button>
      </Box>
      {addresses.length > 0 && (
        <Box className="mx-4">
          <ListRenderer
            gap={4}
            items={addresses}
            renderLeft={(item) => {
              return (
                <Box className=" bg-transparent mb-2 flex items-center justify-center">
                  {item?.type === "home" ? (
                    <Icon icon="zi-home" />
                  ) : (
                    <Icon icon="zi-location" />
                  )}
                </Box>
              );
            }}
            renderRight={(item) => {
              return (
                <Box
                  flex
                  className="space-x-3 "
                  onClick={() => onclickAddress(item)}
                >
                  <Box className="space-y-1 flex-1">
                    <Text className="font-bold ">Người nhận: {item.name}</Text>

                    <Text>Địa chỉ: {getAddress(item)}</Text>

                    <Text>SDT: {item?.phone}</Text>
                  </Box>
                  <Box className="mt-4">
                    <Icon icon="zi-chevron-right" />
                  </Box>
                </Box>
              );
            }}
          />
        </Box>
      )}
    </Page>
  );
}

export default UserAddress;
