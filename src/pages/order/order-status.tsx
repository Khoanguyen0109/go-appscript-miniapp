import { EOrderStatus } from "constantsapp";
import React, { useMemo } from "react";
import { Box, Icon, Text } from "zmp-ui";

type Props = { status };

function OrderStatus({ status }: Props) {
  const statusItem = useMemo(() => {
    switch (status) {
      case EOrderStatus.WAITING:
        return {
          title: "Đang xác nhận",
          backgroundColor: "#FFE5D0",
          color: "#FD7E14",
          icon: "zi-clock-1",
        };

      case EOrderStatus.DELIVERING:
        return {
          title: "Đang vận chuyển",
          backgroundColor: "#CFE2FF",
          color: "#0A58CA",
          icon: "zi-leave",
        };
      case EOrderStatus.DELIVERED:
        return {
          title: "Đã vận chuyển",
          backgroundColor: "#D7FAE0",
          color: "#007D3A",
          icon: "zi-check-circle",
        };
      case EOrderStatus.CANCEL:
        return {
          title: "Đã huỷ",
          color: "bg-red",
          icon: "zi-close",
        };
      default:
        return {
          title: "Đang xác nhận",
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
          backgroundColor: statusItem.backgroundColor,
          width: "fit-content",
        }}
        className={`rounded-full px-3 py-2 items-center w-auto   text-white font-semibold flex`}
      >
        {/* <Icon icon={statusItem.icon} className="text-white mr-2" /> */}
        <Text className="font-semibold">{statusItem.title}</Text>
      </Box>
    </Box>
  );
}

export default OrderStatus;
