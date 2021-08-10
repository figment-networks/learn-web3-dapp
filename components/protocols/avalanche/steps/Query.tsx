import { useState } from "react";
import { Button, Space, Col, Typography } from "antd";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";

import { AvalancheQueryResponse } from "types/avalanche-types";
import styled from "styled-components";

const { Text } = Typography;

const Query = () => {
  const [queryData, setQueryData] = useState<AvalancheQueryResponse | null>(
    null
  );
  const [fetching, setFetching] = useState<boolean>(false);

  const getQuery = () => {
    setFetching(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/avalanche/query`)
      .then((res) => {
        const data: AvalancheQueryResponse = res.data;
        setQueryData(data);
        setFetching(false);
      })
      .catch((err) => {
        console.log(err);
        setFetching(false);
      });
  };

  return (
    <Col>
      <Space direction="vertical" size="large">
        <Space direction="vertical">
          <Text>We can query information from Avalanche using the InfoAPI</Text>
          <Button type="primary" onClick={getQuery}>
            Query the network
          </Button>
          {fetching ? (
            <LoadingOutlined style={{ fontSize: 24 }} spin />
          ) : queryData ? (
            <Code>{JSON.stringify(queryData, null, 2)}</Code>
          ) : null}
        </Space>
      </Space>
    </Col>
  );
};

const Code = styled.pre`
  font-size: 0.9em;
  padding: 10px;
  background-color: #eee;
  margin-top: 20px;
`;

export default Query;
