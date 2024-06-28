import React, { FC, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Header,
  Icon,
  Input,
  Modal,
  Page,
  Select,
  Text,
  useSnackbar,
} from "zmp-ui";
import subscriptionDecor from "static/subscription-decor.svg";
import { ListRenderer } from "components/list-renderer";
import { useToBeImplemented } from "hooks";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "./route";
import { useRecoilState, useRecoilValue } from "recoil";
import { qrImageSelector, userRequestStatusState, userState } from "state";
import MemberCard from "./user/components/member-card";
import supabase from "../client/client";
import { ERoles } from "../constants";
import { CiWallet } from "react-icons/ci";
import { CiBank } from "react-icons/ci";
import logo from "static/logo.jpg";
import { EUserCTVRequestStatus } from "../constantsapp";
import qr_image from "assets/qr_image.jpg";
import { openShareSheet, saveImageToGallery } from "zmp-sdk";
const { OtpGroup, Option } = Select;

const Subscription: FC = () => {
  const user = useRecoilValue(userState);
  const [userRequestStatus, setUserRequestStatus] = useRecoilState(
    userRequestStatusState
  );
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const handleRegister = async () => {
    await supabase
      .from("users")
      .update({
        requestCTVStatus: EUserCTVRequestStatus.WAITING,
      })
      .eq("id", user.id);
    setUserRequestStatus(EUserCTVRequestStatus.WAITING);
    setConfirmModalVisible(false);
  };
  if (userRequestStatus === EUserCTVRequestStatus.WAITING) {
    return (
      <Box className="m-4">
        <Box
          className="bg-yellow-300 text-white rounded-xl p-4 space-y-2"
          style={{
            backgroundImage: `url(${subscriptionDecor})`,
            backgroundPosition: "right 8px center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Text.Title className="font-bold">Đăng chờ duyệt</Text.Title>
        </Box>
      </Box>
    );
  }
  return (
    <>
      <Box className="m-4" onClick={() => setConfirmModalVisible(true)}>
        <Box
          className="bg-green text-white rounded-xl p-4 space-y-2"
          style={{
            backgroundImage: `url(${subscriptionDecor})`,
            backgroundPosition: "right 8px center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Text.Title className="font-bold">Đăng ký Cộng tác viên</Text.Title>
        </Box>
      </Box>
      <Modal
        visible={confirmModalVisible}
        title="Đăng ký Cộng tác viên"
        coverSrc={logo}
        description={`Bạn xác nhận đăng ký làm công tác viên Mion?`}
        actions={[
          {
            text: "Huỷ",
            onClick: () => {
              setConfirmModalVisible(false);
            },
          },
          {
            highLight: true,
            text: "Đồng ý",
            onClick: () => {
              handleRegister();
            },
          },
        ]}
      ></Modal>
    </>
  );
};

const Personal: FC = () => {
  const navigate = useNavigate();
  const onClick = useToBeImplemented();
  const user = useRecoilValue(userState);
  const navigateToOrder = () => {
    navigate(ROUTES.ORDER);
  };

  const navigateToUserAddress = () => {
    navigate(ROUTES.USER_ADDRESS);
  };
  return (
    <Box className="m-4">
      <ListRenderer
        padding={3}
        // onClick={onClick}
        items={[
          // {
          //   left: <Icon icon="zi-user" />,
          //   right: (
          //     <Box flex onClick={onClick}>
          //       <Text.Header className="flex-1 items-center font-normal">
          //         Thông tin tài khoản
          //       </Text.Header>
          //       <Icon icon="zi-chevron-right" />
          //     </Box>
          //   ),
          // },
          ...([ERoles.CTV, ERoles.SHIPPER].includes(user.role)
            ? [
                {
                  left: <CiWallet />,
                  right: (
                    <Box flex onClick={() => navigate(ROUTES.INCOME)}>
                      <Text.Header className="flex-1 items-center font-normal">
                        Thu nhập
                      </Text.Header>
                      <Icon icon="zi-chevron-right" />
                    </Box>
                  ),
                },
                {
                  left: <CiBank />,
                  right: (
                    <Box flex onClick={() => navigate(ROUTES.BANK_ACCOUNT)}>
                      <Text.Header className="flex-1 items-center font-normal">
                        Tài khoản ngân hàng
                      </Text.Header>
                      <Icon icon="zi-chevron-right" />
                    </Box>
                  ),
                },
              ]
            : []),
          {
            left: <Icon icon="zi-clock-2" />,
            right: (
              <Box flex onClick={navigateToOrder}>
                <Text.Header className="flex-1 items-center font-normal">
                  Lịch sử đơn hàng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-check-circle" />,
            right: (
              <Box flex onClick={() => navigate(ROUTES.USER_VOUCHER)}>
                <Text.Header className="flex-1 items-center font-normal">
                  Ưu đãi của tôi
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            onClick: () => navigateToUserAddress(),
            left: <Icon icon="zi-home" />,
            right: (
              <Box flex onClick={navigateToUserAddress}>
                <Text.Header className="flex-1 items-center font-normal">
                  Địa chỉ
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

const Other: FC = () => {
  const navigate = useNavigate();
  // const onClick = useToBeImplemented();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [issue, setIssue] = useState("Vấn đề về đơn hàng");
  const [note, setNote] = useState("");
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
  const user = useRecoilValue(userState);
  const onChange = (e) => {
    setNote(e.target.value);
  };

  const timmerId = useRef();

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );

  const submit = async () => {
    try {
      if (note === "") {
        return openSnackbar({
          text: "Vui lòng nhập ghi chú",
          type: "error",
          icon: true,
          duration: 1000,
        });
      }

      await supabase.from("feedbacks").insert({
        feedback: issue,
        note,
        userId: user.id,
      });
      setNote("");
      setDialogVisible(false);
      return openSnackbar({
        text: "Góp ý của bạn đã được gửi đi",
        type: "success",
        icon: true,
        duration: 2000,
      });
      // }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Box className="m-4">
      <ListRenderer
        padding={3}
        items={[
          ...(user?.ctv
            ? [
                {
                  left: <Icon icon="zi-star" />,
                  right: (
                    <Box flex onClick={() => navigate(ROUTES.COMMISSION)}>
                      <Text.Header className="flex-1 items-center font-normal">
                        Thống kê hoa hồng
                      </Text.Header>
                      <Icon icon="zi-chevron-right" />
                    </Box>
                  ),
                },
              ]
            : []),

          {
            left: <Icon icon="zi-call" />,
            right: (
              <Box flex onClick={() => setDialogVisible(true)}>
                <Text.Header className="flex-1 items-center font-normal">
                  Liên hệ và góp ý
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
      <Modal
        visible={dialogVisible}
        title="Liện hệ & góp ý"
        actions={[
          {
            text: "Huỷ",
            onClick: () => {
              setNote("");
              setDialogVisible(false);
            },
          },
          {
            text: "Gửi",
            onClick: () => submit(),
            highLight: true,
          },
        ]}
      >
        <Select
          value={issue}
          placeholder="Vấn đề cần góp ý"
          onChange={(value) => setIssue(value)}
          closeOnSelect
        >
          <Option value="Vấn đề về đơn hàng" title="Vấn đề về đơn hàng" />
          <Option value="Vấn đề về sản phẩm" title="Vấn đề về sản phẩm" />
          <Option value="Vấn đề về dịch vụ" title="Vấn đề về dịch vụ" />
          <Option value="Khác" title="Khác" />
        </Select>
        <Box className="mb-3" />
        <Input.TextArea
          helperText="Nội dung góp ý"
          value={note}
          onChange={onChange}
        />
      </Modal>
    </Box>
  );
};

const ProfilePage: FC = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const qrImageUrl = useRecoilValue(qrImageSelector);
  const saveImage = () => {
    saveImageToGallery({
      imageUrl: qrImageUrl,
      success: () => {},
      fail: (error) => {
        console.log(error);
      },
    });
  };

  const shareImage = () => {
    openShareSheet({
      type: "image",
      data: {
        imageUrl: qrImageUrl,
      },
      success: (data) => {},
      fail: (err) => {},
    });
  };

  return (
    <Page>
      <Header showBackIcon={false} title="&nbsp;" />
      {user?.role !== ERoles.CTV && (
        <Box onClick={() => navigate(ROUTES.MEMBER_CARD)}>
          <MemberCard />
        </Box>
      )}

      <Personal />
      <Other />
      {user?.role !== ERoles.CTV && user?.role !== ERoles.SHIPPER && (
        <Subscription />
      )}

      <img src={qr_image} className="w-56 m-auto" />
      <Box className="flex justify-between w-1/2 m-auto mt-4 mb-4">
        <Button
          className="w-20 border-[1px] border-yellow-300 border-solid bg-white text-yellow-500"
          size="small"
          onClick={saveImage}
        >
          Tải về
        </Button>
        <Button className="w-20" size="small" onClick={shareImage}>
          Chia sẻ
        </Button>
      </Box>
    </Page>
  );
};

export default ProfilePage;
