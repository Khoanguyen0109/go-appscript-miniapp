import { EScoreRank } from "constantsapp";
import { scoreRankState } from "pages/index/state";
import { ROUTES } from "pages/route";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState, useTotalPointState } from "state";
import badgeIcon from "static/icons/badge.svg";
import { Box, Progress, Text } from "zmp-ui";
import { DisplayCoinNoMoney } from "../../../components/display/display-coin-with-no-money";
import { Divider } from "../../../components/divider";
import { formatDecimal } from "../../../utils/number";

type Props = {};

function MemberCard({}: Props) {
  const navigate = useNavigate();
  const scoreRank = useRecoilValue(scoreRankState);
  const user = useRecoilValue(userState);
  const userTotalPoint = useRecoilValue(useTotalPointState);;

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

  return (
    <Box className="m-4" onClick={() => navigate(ROUTES.MEMBER_CARD)}>
      <Box className="bg-white rounded-xl p-4 space-y-2 border-2">
        <Box className="flex items-center space-x-2">
          <Box
            className={
              "bg-nature-100 border-[1px] border-solid rounded-xl size-8 border-nature-800 flex items-center justify-center"
            }
          >
            <img
              src={badgeIcon}
              alt="Badge"
              className="size-6 filter-bg-nature-900"
            />
          </Box>
          <Box>
            <Text size="small">Thứ hạng của bạn</Text>
            <Text size={"small"} className="font-bold">
              {user?.memberClass || EScoreRank.NEW}
            </Text>
          </Box>
        </Box>

        <Text size="xSmall" className="text-gray-500">
          Để nâng lên thứ hạng tiếp theo
        </Text>

        <Box className="flex justify-between items-center">
          <Text size={"xSmall"}>Chi tiêu</Text>
          <Text.Title className="text-nature-700 font-semibold">
            {formatDecimal(parseInt(maxScore))}
          </Text.Title>
        </Box>
        <Divider size={1} className="flex-1 my-2 bg-nature-500" />

        <Box className="flex justify-between mt-1">
          <Box className="w-1/2">
            <Text size="normal" className="text-nature-700 font-bold">
              <DisplayCoinNoMoney>{userTotalPoint}</DisplayCoinNoMoney>
            </Text>
            <Text size="xxSmall" className="text-gray-500">
              Điểm
            </Text>
          </Box>

          <Box className="w-1/2 justify-end">
            <Text className={"flex place-content-end"}>
              {userTotalPoint}/{parseInt(maxScore)}
            </Text>
            <Box className={"flex"}>
              <Progress
                completed={user?.scorce}
                maxCompleted={parseInt(maxScore)}
                trailColor={"#e0e0e0"}
                strokeColor={"#0B8A3F"}
                strokeWidth={10}
              />
              <img
                src={badgeIcon}
                alt="Badge"
                className="size-6 filter-primary"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MemberCard;
