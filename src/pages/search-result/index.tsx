import React, { useCallback, useState } from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { setStorage } from "zmp-sdk";
import { Box, Button, Header, Icon, Input, Page, useNavigate } from "zmp-ui";
import LoadingScreenOverLay from "../../components/loading-screen";
import {
  historySearchListState,
  searchResultState,
  searchState,
} from "../../state";
import NewProductItem from "../index/new-product-item";
import { ROUTES } from "../route";

function SearchResult() {
  const searchResult = useRecoilValueLoadable(searchResultState);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [search, setSearch] = useRecoilState(searchState);
  const [historySearch, setHistory] = useRecoilState(historySearchListState);
  const submitSearch = () => {
    if (input) {
      setSearch(input);
      setHistory([...historySearch, input]);
      setStorage({
        data: {
          history: [...historySearch, input],
        },
        success: (data) => {
          // xử lý khi gọi api thành công
          // const { errorKeys } = data;
        },
        fail: (error) => {
          // xử lý khi gọi api thất bại
          console.log(error);
        },
      });
      navigate(ROUTES.SEARCH_RESULT);
    }
  };
  const inputFocus = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);
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
        <Box className="p-2 flex items-center w-full">
          <Input
            ref={inputFocus}
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="inquiry  bg-[#EFFEF5] border-nature-700 text-black"
            placeholder="Tìm kiếm"
          />
          <Button
            size="small"
            onClick={submitSearch}
            className={"ml-2  flex items-center p-2 justify-center rounded-lg"}
          >
            <Icon icon="zi-search" />
          </Button>
        </Box>
        <Box className="p-2 grid grid-cols-2 gap-2 w-full">
          {searchResult.contents.length !== 0 ? (
            searchResult.contents.map((item, index) => (
              <NewProductItem product={item} key={index} />
            ))
          ) : (
            <>
              <Box className="mt-10 text-center col-span-2">
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
