import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { cartState, totalQuantityState } from "state";
import { Box, Text } from "zmp-ui";
import cartIcon from "static/icons/cart.svg";

export const CartIcon: FC<{ active?: boolean }> = ({ active }) => {
  const quantity = useRecoilValue(totalQuantityState);

  return (
    <Box className="relative">
      {active ? (
        <img src={cartIcon} alt="Cart" className={'nav-primary-color'}/>
      ) : (
        <img src={cartIcon} alt="Cart"/>
      )}
      {quantity > 0 && (
        <Box className="absolute -right-2 -top-[2px] p-[2px] bg-background rounded-full">
          <Text
            className="w-4 h-4 bg-red-500 rounded-full text-white"
            size="xxxxSmall"
          >
            {quantity > 9 ? "9+" : quantity}
          </Text>
        </Box>
      )}
    </Box>
  );
};