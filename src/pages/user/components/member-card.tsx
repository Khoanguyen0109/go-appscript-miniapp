import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import { Box, Progress, Slider, Text } from "zmp-ui";
import silver from "static/member-card/silver.jpg";
import gold from "static/member-card/gold.png";
import diamond from "static/member-card/diamond.jpg";
import newMember from "static/subscription-decor.svg";
import { ROUTES } from "pages/route";
import { EScoreRank } from "constantsapp";
import { scoreRankState } from "pages/index/state";

type Props = {};

function MemberCard({}: Props) {
  const navigate = useNavigate();
  const scoreRank = useRecoilValue(scoreRankState);
  const user = useRecoilValue(userState);
  const backgroundCard = useMemo(() => {
    switch (user.memberClass) {
      case EScoreRank.NEW:
        return newMember;
      case EScoreRank.SILVER:
        return silver;
      case EScoreRank.GOLD:
        return gold;
      case EScoreRank.DIAMOND:
        return diamond;
      default:
        return newMember;
    }
  }, []);

  const maxScore = useMemo(() => {
    switch (user.memberClass) {
      case EScoreRank.NEW:
        return scoreRank.find((item) => item.name === EScoreRank.SILVER).value;
      case EScoreRank.SILVER:
        return scoreRank.find((item) => item.name === EScoreRank.GOLD).value;
      case EScoreRank.GOLD:
        return scoreRank.find((item) => item.name === EScoreRank.DIAMOND).value;
      default:
        return null;
    }
  }, [user]);

  console.log("maxScore", maxScore);
  return (
    <Box className="m-4" onClick={() => navigate(ROUTES.MEMBER_CARD)}>
      <Box
        className="bg-green text-black rounded-xl p-4 space-y-2"
        style={{
          backgroundImage: `url(${backgroundCard})`,
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box className="flex justify-between items-center">
          <Text.Title className="font-bold">
            Thành viên {user?.memberClass || EScoreRank.NEW}
          </Text.Title>
          <Text.Title className="font-bold">{user?.score || 0} Điểm</Text.Title>
        </Box>

        {maxScore && (
          <>
            <Box mb={4}>
              <Progress
                strokeColor="black"
                completed={parseInt(user.score)}
                maxCompleted={parseInt(maxScore)}
              />
            </Box>
            <Text size="small">
              Cần hoàn thành {maxScore} điểm để tăng hạng thành viên
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
}

export default MemberCard;
