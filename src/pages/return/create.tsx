import { DisplayPrice } from "components/display/price";
import { Divider } from "components/divider";
import { useVirtualKeyboardVisible } from "hooks";
import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { Box, Header, Page, Text } from "zmp-ui";
import { totalPriceReturnState } from "../../state";
import { ReturnCartItems } from "./cart-items";
import { ReturnReview } from "./preview";

const CreateReturnPage: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const totalPrice = useRecoilValue(totalPriceReturnState);
  return (
    <Page className="flex flex-col bg-[#f4f5f7]">
      <Header className="text-center" title="Giỏ hàng" showBackIcon={true} />
      <ReturnCartItems disableClick={false} />
      <Divider size={12} className="flex-1" />
      <Box className={"flex items-center bg-white justify-between mb-2 rounded-lg mx-2 p-2"}>
        <Text className="text-md px-2">Tổng tiền hoàn</Text>
        <Text.Title size="large" className="px-2 text-nature-500 font-semibold">
          <DisplayPrice>{totalPrice}</DisplayPrice>
        </Text.Title>
      </Box>
      {!keyboardVisible && <ReturnReview />}
    </Page>
  );
};

export default CreateReturnPage;
