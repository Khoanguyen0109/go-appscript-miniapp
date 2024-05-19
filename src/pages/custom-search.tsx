import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
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
import { getStorage, setStorage } from "zmp-sdk";
import { historySearchListState, searchState } from "../state";
import { ROUTES } from "./route";

type Props = {};

function Search({}: Props) {
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

  return (
    <Page className=" bg-white">
      <Header title="Tìm kiếm" />

      <Box className="p-2 flex items-center">
        <Input.Search
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="inquiry  bg-white border-primary"
          placeholder="Tìm kiếm"
        />
        <Button
          size="small"
          onClick={submitSearch}
          className={"ml-1  flex items-center justify-center rounded-md"}
        >
          <Icon icon="zi-search" />
        </Button>
      </Box>

      <Box className="mt-3 p-2">
        {historySearch.map(
          (item) =>
            item && (
              <Text.Title className="mb-2" onClick={() => onItemClick(item)}>
                {item}{" "}
              </Text.Title>
            )
        )}
      </Box>
    </Page>
  );
}

export default Search;
