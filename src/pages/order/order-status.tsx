import React, { useMemo } from "react";
import { Box, Icon, Text } from "zmp-ui";

type Props = { status };

export const EOrderStatus = {
  WAITING: "waiting",
  DELIVERING: "delivering",
  DELIVERED: "delivered",
  CANCEL: "cancel",
};

function OrderStatus({ status }: Props) {
  const statusItem = useMemo(() => {
    switch (status) {
      case EOrderStatus.WAITING:
        return {
          title: "Đang xác nhận",
          color: "bg-slate-400",
          icon: "zi-clock-1",
        };

      case EOrderStatus.DELIVERING:
        return {
          title: "Đang vận chuyển",
          color: "bg-yellow",
          icon: "zi-leave",
        };
      case EOrderStatus.DELIVERED:
        return {
          title: "Đã vận chuyển",
          color: "bg-green",
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
          color: "bg-slate-400",
          icon: "zi-clock-1",
        };
    }
  }, [status]);

  return (
    <Box className="py-3 px-4">
      <Box
        className={`${statusItem.color} w-52 rounded-xl p-2 items-center   text-white font-semibold flex`}
      >
        <Icon icon={statusItem.icon} className="text-white mr-2 " />
        <Text className="font-semibold">{statusItem.title}</Text>
      </Box>
    </Box>
  );
}

export default OrderStatus;
