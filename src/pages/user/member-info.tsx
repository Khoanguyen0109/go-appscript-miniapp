import React, { useState } from "react";
import { Box, Button, Header, Page, Tabs, Text } from "zmp-ui";
import MemberCard from "./components/member-card";
import { openWebview } from "zmp-sdk";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import { scoreRankState } from "pages/index/state";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "pages/route";

type Props = {};

function MemberInfo({}: Props) {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const scoreRank = useRecoilValue(scoreRankState);
  const [activeTab, setActiveTab] = useState(
    scoreRank.findIndex((item) => item.name === user.memberClass) !== -1
      ? scoreRank.findIndex((item) => item.name === user.memberClass).toString()
      : "1"
  );
  const openUrlInWebview = async () => {
    try {
      await openWebview({
        url: user.linkLichSuTichDiem,
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const onChange = (val) => {
    setActiveTab(val);
  };
  return (
    <Page>
      <Header
        title="Thông tin thành viên"
        showBackIcon={true}
        onBackClick={() => navigate("/profile")}
      />
      <MemberCard />
      <Box className="p-4">
        <Button className="w-full" onClick={openUrlInWebview}>
          Lịch sử tích điểm
        </Button>

        <Box className="mt-4">
          <Tabs id="contact-list" activeKey={activeTab} onChange={onChange}>
            {scoreRank.map((item, index) => (
              <Tabs.Tab key={index} label={item.name}>
                <Text className="mt-3 ">
                  {item.sub_value.indexOf("</") !== -1 ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.sub_value.replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        ),
                      }}
                    ></div>
                  ) : (
                    item.sub_value
                  )}
                </Text>
              </Tabs.Tab>
            ))}
          </Tabs>
        </Box>
      </Box>
    </Page>
  );
}

export default MemberInfo;
