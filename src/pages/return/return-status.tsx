import {
  EOrderReturnStatus,
  EOrderStatus,
  getOrderReturnStatusLabel,
} from "constantsapp";
import React, { useMemo } from "react";
import { Box, Text } from "zmp-ui";

type Props = { status };

function OrderStatus({ status }: Props) {
  const statusItem = useMemo(() => {
    const title = getOrderReturnStatusLabel(status);
    switch (status) {
      case EOrderReturnStatus.WAITING_CONFIRMATION:
        return {
          title,
          backgroundColor: "#FFE5D0",
          color: "#ff7300",
          icon: "zi-clock-1",
        };
      case EOrderReturnStatus.ACCEPT_RETURN:
        return {
          title,
          backgroundColor: "#CFE2FF",
          color: "#0A58CA",
          icon: "zi-leave",
        };
      case EOrderReturnStatus.REJECT_RETURN:
        return {
          title,
          backgroundColor: "#D7FAE0",
          color: "#007D3A",
          icon: "zi-check-circle",
        };
      case EOrderReturnStatus.COMPLETED:
        return {
          title,
          backgroundColor: "#E9ECEF",
          color: "#343A40",
          icon: "zi-check-circle",
        };
      default:
        return {
          title: "Không xác định",
          color: "#343A40",
          backgroundColor: "#E9ECEF",
          icon: "zi-clock-1",
        };
    }
  }, [status]);

  return (
    <Box className="">
      <Box
        style={{
          color: statusItem.color,
          backgroundColor: statusItem.backgroundColor + "!important",
          width: "fit-content",
        }}
        className={`rounded-full px-3 py-2 items-center w-auto   font-semibold flex`}
      >
        {/* <Icon icon={statusItem.icon} className="text-white mr-2" /> */}
        <Text className="font-semibold">{statusItem.title}</Text>
      </Box>
    </Box>
  );
}

export default OrderStatus;
