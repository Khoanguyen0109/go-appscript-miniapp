import React from "react";
import { Box, Header, Page, Text } from "zmp-ui";

type Props = {};

function NotFound({}: Props) {
  return (
    <Page className="flex w-full h-full justify-center align-middle">
      <Header backIcon={true} />
      <Text.Header>Not Found Page</Text.Header>
    </Page>
  );
}

export default NotFound;
