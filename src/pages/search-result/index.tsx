import { Box, Button, Header, Page, Text, useNavigate } from "zmp-ui";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { searchResultState, searchState } from "../../state";
import LoadingScreenOverLay from "../../components/loading-screen";
import { openChat } from "zmp-sdk";
import { FixedSizeList as List } from "react-window";
import { getWindowDimensions } from "../../utils/size";
import NewProductItem from "../index/new-product-item";
import { OA_ID } from "../../enviroment";

function SearchResult() {
  const search = useRecoilValue(searchState);
  const searchResult = useRecoilValueLoadable(searchResultState);
  const { width, height } = getWindowDimensions();
  const navigate = useNavigate();
  console.log("searchResult", searchResult);
  const handleChat = () => {
    openChat({
      type: "oa",
      id: OA_ID,
      message: `Yêu cầu tìm kiếm`,
      success: () => {},
      fail: (err) => {
        console.log("err", err);
      },
    });
  };

  const renderBottom = () => {
    return (
      <Box>
        <Box className="mt-20">Không tìm thấy sản phẩm</Box>
      </Box>
    );
  };

  if (searchResult.state === "loading") {
    return <LoadingScreenOverLay />;
  }

  if (searchResult.state === "hasValue") {
    return (
      <Page
        className={
          "bg-white mx-auto flex flex-col items-center justify-centerr"
        }
      >
        <Header title="Kết quả tìm kiếm" />
        <Box className="p-2 w-full">
          {searchResult.contents.length !== 0
            ? searchResult.contents.map((item) => (
                <NewProductItem product={item} />
              ))
            : renderBottom()}
        </Box>

        <Box className="mt-10">
          <Text className="text-xs mb-1">
            Bạn không tìm thấy sản phẩm phù hợp?
          </Text>
          <Box
            onClick={() => navigate(-1)}
            className={
              " mt-2 border-solid border-1 w-full h-12 flex items-center justify-center rounded-sm text-gray-500 font-semibold"
            }
          >
            <span>Trở về tìm kiếm</span>
          </Box>
        </Box>
      </Page>
    );
  }
}

export default SearchResult;
