import { EOrderStatus } from "../constantsapp";

export const getAddress = (address) => {
  if (!address) {
    return undefined;
  }
  return `${address?.address}, ${address?.ward} , ${address?.district} , ${address?.province}`;
};

export const getOrderStatusLabel = (status) => {
  console.log('status', status)
  switch (status) {
    case EOrderStatus.WAITING:
      return "Chờ xác nhận";
    case EOrderStatus.DELIVERING:
      return "Đang vận chuyển";
    case EOrderStatus.DELIVERED:
      return "Đã vận chuyển";
    case EOrderStatus.CANCEL:
      return "Đã huỷ";
    default:
      return "";
  }
};
