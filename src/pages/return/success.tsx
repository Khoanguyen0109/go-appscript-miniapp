import React from 'react';
import { Page, Text, Icon, Button } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'pages/route';

const ReturnSuccess = () => {
  const navigate = useNavigate();

  return (
    <Page className="bg-white flex flex-col items-center justify-center h-screen">
      <div>
        <Icon icon="zi-check-circle" className="text-green-500 text-6xl mb-4" />
      </div>
      <div>
        <Text.Title className="text-2xl font-bold text-center mb-2">
          Đặt hoàn thành công!
        </Text.Title>
        <Text className="text-gray-600 text-center mb-8">
          Chúng tôi sẽ xem xét và phản hồi cho bạn.
        </Text>
      </div>
      <div>
        <Button
          className="px-8 py-2 bg-blue-500 text-white rounded-full"
          onClick={() => navigate(ROUTES.HOME)}
        >
          Trở về trang chủ
        </Button>
      </div>
    </Page>
  );
};

export default ReturnSuccess;