import { OA_ID } from "enviroment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { appInfoState, userState } from "state";
import { openChat, openWebview } from "zmp-sdk";
import { Avatar, Box, Button, Header, Page, Text } from "zmp-ui";
import { FaHistory } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";

type Props = {};

function Commission({}: Props) {
  const navigate = useNavigate();
  const appInfo = useRecoilValue(appInfoState);
  console.log("appInfo", appInfo);
  const user = useRecoilValue(userState);
  const openOAPayment = () => {
    openChat({
      type: "oa",
      id: OA_ID,
      message: "Rút Tiền",
      success: () => {},
      fail: (err) => {
        console.log("err", err);
      },
    });
  };

  const openHistory = async () => {
    try {
      await openWebview({
        url: user?.linkLichSuDoiSoat,
        config: {
          style: "bottomSheet",
          leftButton: "back",
        },
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCommissionDetail = async () => {
    try {
      await openWebview({
        url: user?.linkChiTietHoaHong,
        config: {
          style: "bottomSheet",
          leftButton: "back",
        },
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  return (
    <Page className="bg-white ">
      <Header title="Doanh thu liên kết" showBackIcon={true} />
      <Box className="p-4 rounded-lg">
        <Box className="flex flex-col justify-center items-center mb-4 pb-3  ">
          <Avatar className="mb-3" size={54} />
          <Text className="mb-1">{user.name}</Text>
          <Text className="text-xs">ID: {user.id}</Text>
        </Box>
        <Box>
          <Text className="font-bold mb-1 text-lg">Doanh thu liên kết</Text>
          <Box className="flex justify-between items-center">
            <Text>Tổng doanh thu</Text>
            <Text>{user?.totalhoaHong || 0} ₫</Text>
          </Box>
        </Box>
        <Box className=" mt-5">
          <CopyToClipboard text={appInfo.appUrl + `?id_ctv_shared=${user.id}`}>
            <Box className="w-full flex bg-blue-200 p-2 rounded-full items-center">
              <Text className="truncate flex-1">{appInfo.appUrl}</Text>
              <Button className="" size="small">
                Copy link
              </Button>
            </Box>
          </CopyToClipboard>

          <Button
            variant="primary"
            className="w-full mt-2"
            onClick={openOAPayment}
          >
            Rút tiền
          </Button>
        </Box>
      </Box>
      <Box className="p-4">
        <Text className="font-bold mb-1 text-lg">Thống kê hoa hồng</Text>
        <Box className="flex flex-col justify-center items-center border-b-2 border-slate-400 p-3">
          <Text className="mb-1 font-light">Tổng số hoa hồng</Text>
          <Text className="font-bold text-lg">{user?.totalhoaHong || 0} ₫</Text>
        </Box>
        <Box className="flex justify-between items-center mt-4">
          <Text>Hoa hồng có thể rút</Text>
          <Text className="text-green">{user?.daDoiSoat || 0} ₫</Text>
        </Box>
        <Box className="flex justify-between items-center mt-2">
          <Text>Hoa hồng chưa ₫ối soát</Text>
          <Text className="text-red-400">{user?.chuaDoiSoat || 0} ₫</Text>
        </Box>
        <Box className=" flex justify-between mt-5">
          <Button onClick={() => openHistory()}>
            <Box className="flex items-center justify-between">
              <FaHistory />
              <Text>Lịch sử đối soát</Text>
            </Box>
          </Button>
          <Button className="ml-2" onClick={() => openCommissionDetail()}>
            <Box className="flex items-center">
              <MdOutlinePayment /> <Text>Chi tiết hoa hồng</Text>
            </Box>
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export default Commission;
