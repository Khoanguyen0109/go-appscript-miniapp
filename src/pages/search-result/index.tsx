import { Box, Header, Page, useNavigate } from "zmp-ui";
import React from "react";
import { useRecoilValueLoadable } from "recoil";
import { searchResultState } from "../../state";
import LoadingScreenOverLay from "../../components/loading-screen";
import { openChat } from "zmp-sdk";
import { getWindowDimensions } from "../../utils/size";
import NewProductItem from "../index/new-product-item";
import { OA_ID } from "../../enviroment";

function SearchResult() {
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
          {searchResult.contents.length !== 0 ? (
            searchResult.contents.map((item) => (
              <NewProductItem product={item} />
            ))
          ) : (
            <>
              <Box className="mt-10 text-center">
                <Box className="mt-20 mb-7">Không tìm thấy sản phẩm</Box>

                <Box
                  onClick={() => navigate(-1)}
                  className={
                    " mt-2 border-solid border-1 w-full h-12 flex items-center justify-center rounded-sm text-gray-500 font-semibold"
                  }
                >
                  <span>Trở về tìm kiếm</span>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Page>
    );
  }
}

export default SearchResult;
