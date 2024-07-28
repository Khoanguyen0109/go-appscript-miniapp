import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getStorage, setStorage } from "zmp-sdk";
import {
  Box,
  Button,
  Header,
  Icon,
  Input,
  Page,
  Text,
  useNavigate,
} from "zmp-ui";
import {
  historySearchListState,
  productsState,
  returnHistoryState,
  searchState,
} from "../state";
import { ROUTES } from "./route";

type Props = {};

function Search({}: Props) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [search, setSearch] = useRecoilState(searchState);
  const products = useRecoilValue(productsState);
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
  const getData = async () => {
    try {
      const { history } = await getStorage({
        keys: ["history"],
      });
      if (history) {
        setHistory(history);
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  useEffect(() => {
    setInput("");
    getData();
  }, []);

  const onItemClick = (value: string) => {
    setSearch(value);
    navigate(ROUTES.SEARCH_RESULT);
  };

  const inputFocus = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <Page className=" bg-white">
      <Header title="Tìm kiếm" />

      <Box className="p-2 flex items-center">
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

      <Box className="mt-3 p-2">
        <Text.Title className="mb-2">Lịch sử tìm kiếm</Text.Title>
        {historySearch.map(
          (item) =>
            item && (
              <Text className="mb-2" onClick={() => onItemClick(item)}>
                {item}{" "}
              </Text>
            )
        )}
        <Text.Title className="mt-4 mb-2">Gợi ý</Text.Title>
        {products
          .slice(0, 5)
          .map((product) => (
            <Box
              key={product.id}
              className="flex items-center mb-2"
              onClick={() => onItemClick(product.name)}
            >
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-10 h-10 object-cover rounded-md mr-2"
              />
              <Text>{product.name}</Text>
            </Box>
          ))}
      </Box>
    </Page>
  );
}

export default Search;
