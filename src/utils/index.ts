import { EOrderStatus } from "../constantsapp";

export const getAddress = (address) => {
  if (!address) {
    return undefined;
  }
  return `${address?.address}, ${address?.ward} , ${address?.district} , ${address?.province}`;
};

export const getOrderStatusLabel = (status) => {
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

export const getStatusTextColor = (status) => {
  switch (status) {
    case EOrderStatus.WAITING:
      return "text-yellow-500";
    case EOrderStatus.DELIVERING:
      return "text-blue-500";
    case EOrderStatus.DELIVERED:
      return "text-green";
    case EOrderStatus.CANCEL:
      return "text-red-500";
    default:
      return "";
  }
};

export const getStatusBGColor = (status) => {
  switch (status) {
    case EOrderStatus.WAITING:
      return "bg-orange-100	";
    case EOrderStatus.DELIVERING:
      return "bg-blue-200";
    case EOrderStatus.DELIVERED:
      return "bg-lime-200	";
    case EOrderStatus.CANCEL:
      return "bg-red-200";
    default:
      return "";
  }
};
