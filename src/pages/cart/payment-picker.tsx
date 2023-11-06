import { ActionSheet } from "components/fullscreen-sheet";
import { ListItem } from "components/list-item";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { selectedPaymentMethod } from "./state";

type Props = {};

const paymentMethodList = [
  { id: 0, label: "COD", value: "cod", subtitle: "Thanh toán khi nhận hàng" },
  {
    id: 1,
    label: "Chuyển khoản",
    value: "chuyen_khoan",
    subtitle: "Thanh toán chuyển khoản qua ngân hàng",
  },
];

function PaymentPicker({}: Props) {
  const [visible, setVisible] = useState(false);

  const [paymentMethod, setPaymentMethod] = useRecoilState(
    selectedPaymentMethod
  );
  console.log("visible", visible);
  if (!paymentMethod && !visible) {
    return <RequestPayment onClick={() => setVisible(true)} />;
  }
  return (
    <>
      <ListItem
        onClick={() => setVisible(true)}
        title={paymentMethod?.label}
        subtitle={paymentMethod?.subtitle}
      />
      {createPortal(
        <ActionSheet
          title="Chọn phương thức thanh toán"
          visible={visible}
          onClose={() => setVisible(false)}
          actions={[
            paymentMethodList.map((item) => {
              return {
                text: item?.label || "",
                highLight: item.id === paymentMethod?.id,

                onClick: () => {
                  setPaymentMethod(item);
                },
              };
            }),
            [{ text: "Đóng", close: true, danger: true }],
          ]}
        ></ActionSheet>,
        document.body
      )}
    </>
  );
}

export const RequestPayment: React.FC = ({ onClick }) => {
  return (
    <ListItem
      onClick={onClick}
      title="Phương thức thanh toán"
      subtitle="Vui lòng chọn phương thức thanh toán"
    />
  );
};

export default PaymentPicker;
