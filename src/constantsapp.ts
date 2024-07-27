export enum EOrderStatus {
  WAITING = "waiting",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  CANCEL = "cancel",
}
/**
 * Order Return status enum
 *
 * Vietnamese translations:
 * WAITING_CONFIRMATION: Chờ xác nhận
 * ACCEPT_RETURN: Chấp nhận hoàn trả
 * REJECT_RETURN: Không Chấp nhận hoàn trả
 * COMPLETED: Hoàn thành
 *
 * Additional statuses:
 * returning
 * accept_return
 * returned
 */
export enum EOrderReturnStatus {
  WAITING_CONFIRMATION = "waiting_confirmation",
  ACCEPT_RETURN = "accept_return",
  REJECT_RETURN = "reject_return",
  COMPLETED = "completed",
}

export function getOrderReturnStatusLabel(status: EOrderReturnStatus): string {
  switch (status) {
    case EOrderReturnStatus.WAITING_CONFIRMATION:
      return "Chờ xác nhận";
    case EOrderReturnStatus.ACCEPT_RETURN:
      return "Chấp nhận hoàn trả";
    case EOrderReturnStatus.REJECT_RETURN:
      return "Không chấp nhận hoàn trả";
    case EOrderReturnStatus.COMPLETED:
      return "Hoàn thành";
    default:
      return "Không xác định";
  }
}

export enum EScoreRank {
  SILVER = "Bạc",
  GOLD = "Vàng",
  NEW = "Mới",
  DIAMOND = "Kim cương",
}

export enum EUserVoucherStatus {
  UNUSED = "unused",
  USED = "used",
}

export enum EUserCTVRequestStatus {
  WAITING = "waiting",
  DONE = "done",
}
