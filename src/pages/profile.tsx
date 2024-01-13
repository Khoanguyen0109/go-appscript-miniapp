import React, { FC, useEffect, useRef, useState } from "react";
import {
  Box,
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
import { axiosInstance } from "api/instance";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import { openChat } from "zmp-sdk";
import { OA_ID } from "enviroment";
import MemberCard from "./user/components/member-card";

const { OtpGroup, Option } = Select;

const Subscription: FC = () => {
  const onClick = useToBeImplemented();
  const openChatScreen = () => {
    openChat({
      type: "oa",
      id: OA_ID,
      message: "CTV",
      success: () => {},
      fail: (err) => {
        console.log("err", err);
      },
    });
  };
  return (
    <Box className="m-4" onClick={openChatScreen}>
      <Box
        className="bg-green text-white rounded-xl p-4 space-y-2"
        style={{
          backgroundImage: `url(${subscriptionDecor})`,
          backgroundPosition: "right 8px center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Text.Title className="font-bold">Đăng ký Cộng tác viên</Text.Title>
        {/* <Text size="xxSmall">Tích điểm đổi thưởng, mở rộng tiện ích</Text> */}
      </Box>
    </Box>
  );
};

const Personal: FC = () => {
  const navigate = useNavigate();
  const onClick = useToBeImplemented();

  const navigateToOrder = () => {
    navigate(ROUTES.ORDER);
  };

  const navigateToUserAddress = () => {
    navigate(ROUTES.USER_ADDRESS);
  };
  return (
    <Box className="m-4">
      <ListRenderer
        title="Cá nhân"
        // onClick={onClick}
        items={[
          {
            left: <Icon icon="zi-user" />,
            right: (
              <Box flex onClick={onClick}>
                <Text.Header className="flex-1 items-center font-normal">
                  Thông tin tài khoản
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
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
  const onClick = useToBeImplemented();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [issue, setIssue] = useState("Vấn đề về đơn hàng");
  const [note, setNote] = useState("");
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
  const user = useRecoilValue(userState);
  console.log("user", user);
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
      const res = await axiosInstance.post(`/users/${user.id}/feedback`, {
        note,
        issue,
      });
      // if (res) {
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
        title="Khác"
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

  return (
    <Page>
      <Header showBackIcon={false} title="&nbsp;" />
      <Box onClick={() => navigate(ROUTES.MEMBER_CARD)}>
        <MemberCard />
      </Box>

      <Personal />
      <Other />
      {!user?.ctv && <Subscription />}
    </Page>
  );
};

export default ProfilePage;
