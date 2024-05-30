import React from "react";
import { useRecoilValue } from "recoil";
import { Box, Button, Header, Page, Text } from "zmp-ui";
import { userState } from "../../state";
import { DisplayPrice } from "../../components/display/price";
import { ctvIncomeListRequestState } from "../../state/ctv-state";
import CommissionIcon from "../../static/commision-request.svg";
import { formatDate } from "../../utils/date";
import { ECommissionRequest } from "../../constants";

type Props = {};

function Income({}: Props) {
  const user = useRecoilValue(userState);
  const commissionRequest = useRecoilValue(ctvIncomeListRequestState);

  const getStatusColor = (status) => {
    switch (status) {
      case ECommissionRequest.WAITING:
        return "text-yellow-500";
      case ECommissionRequest.DONE:
        return "text-green";
      case ECommissionRequest.CANCEL:
        return "text-red-500";
      default:
        return "";
    }
  };
  const getLabelStatus = (status) => {
    switch (status) {
      case ECommissionRequest.WAITING:
        return "Chờ xác nhận";
      case ECommissionRequest.DONE:
        return "Hoàn thành";
      case ECommissionRequest.CANCEL:
        return "Huỷ";
      default:
        return "";
    }
  };
  return (
    <Page className="">
      <Header title="Doanh thu liên kết" showBackIcon={true} />
      <Box className="p-3  bg-white">
        <Box className="p-4 rounded-lg bg-blue-600 text-white">
          <Box>
            <Text className="text-md font-bold">Số tiền có thể rút</Text>
            <Text className="text-xl mt-2 font-bold">
              <DisplayPrice>{user?.daDoiSoat || 0}</DisplayPrice>
            </Text>
            <Button className="mt-3 bg-white rounded-lg" variant="secondary">
              Gửi yêu cầu thanh toán
            </Button>
          </Box>
          <Box className="mt-3 flex">
            <Box className="border-r-2 flex-1 border-white">
              <Text className="text-sm">Số tiền tổng </Text>
              <Text className="text-xl mt-2 font-bold">
                <DisplayPrice>{user?.totalHoaHong || 0}</DisplayPrice>
              </Text>
            </Box>
            <Box className="flex-1">
              <Text className="text-sm  text-right">Chờ đối soát</Text>
              <Text className="text-xl mt-2 font-bold text-right">
                <DisplayPrice>{user?.chuaDoiSoat || 0}</DisplayPrice>
              </Text>
            </Box>
          </Box>
        </Box>

        <Box className="mt-3">
          <Text className="font-bold text-lg">Lịch sử thanh toán</Text>

          <Box className="w-full">
            {commissionRequest?.map((item) => {
              return (
                <Box className="flex justify-between items-center w-full border-b-[1px] py-2 border-neutral-300	 ">
                  <Box className="flex flex-1">
                    <img src={CommissionIcon} />
                    <Box className="ml-2">
                      <Text className="font-bold">Yêu cầu thanh toán</Text>
                      <Text className="text-neutral-400 text-sm">
                        {formatDate(item?.createdAt)}
                      </Text>
                    </Box>
                  </Box>

                  <Box className="text-right">
                    <Text className="text-blue-500 font-semibold text-lg">
                      <DisplayPrice>{item?.total || 0}</DisplayPrice>
                    </Text>
                    <Text className={`${getStatusColor(item.status)} text-sm`}>
                      {getLabelStatus(item.status)}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default Income;
