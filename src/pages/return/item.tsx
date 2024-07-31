import { DisplayPrice } from "components/display/price";
import { ROUTES } from "pages/route";
import React from "react";
import { useNavigate } from "react-router-dom";
import { TOrder } from "types/order";
import { Box, Text } from "zmp-ui";
import { formatDate } from "../../utils/date";
import ReturnStatus from "./return-status";

type Props = {
  item: TOrder;
  onOpenRating: (id: string) => void;
};

function ReturnItem({ item, onOpenRating }: Props) {
  const navigate = useNavigate();
  console.log(item);
  const onClick = () => {
    console.log("clicked item", item.id);
    navigate(ROUTES.RETURN_DETAIL(item.id));
  };
  return (
    <Box
      className="rounded-lg bg-background m-3 cursor-pointer"
      onClick={onClick}
    >
      <Box className="flex justify-between py-3 pr-3 items-center">
        <ReturnStatus status={item.status} />
        <Text className="text-slate-600">
          {formatDate(item.createdAt) || ""}
        </Text>
      </Box>

      <Box className="px-3 pb-4 mt-2 flex ">
        <img
          className="w-12 h-12 object-cover rounded-2xl mr-3"
          src={
            item?.returnDetails?.[0]?.product?.image ||
            "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8"
          }
        />
        <Box className="flex-1">
          <Text className="font-bold text-md mb-1">
            {/*{item?.returnDetails[0]?.product.name || ""}*/}
          </Text>
          <Box className="flex justify-between mt-2">
            <Text className=" text-md">
              <DisplayPrice>{item?.total || "0"}</DisplayPrice>
            </Text>
            <Box>
              <Text className={'flex items-center'}>
                <span className={'text-gray'}>Mã đơn hàng: </span> <b>{item.id}</b>
              </Text>
              <Text className="text-gray">
                {item.returnDetails.length} sản phẩm
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ReturnItem;
