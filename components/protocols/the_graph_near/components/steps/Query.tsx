import React, {useEffect} from 'react';
import {Alert, Col, Space, Typography} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useLazyQuery,
} from '@apollo/client';
import MOST_VALUABLE_PUNKS_QUERY from '@figment-the-graph/graphql/query';
import {useGlobalState} from 'context';
import {useColors} from 'hooks';
import {StepButton} from 'components/shared/Button.styles';
import Punks from '@figment-the-graph/components/punks';

const {Text} = Typography;

const GRAPHQL_ENDPOINTS = process.env.NEXT_PUBLIC_LOCAL_SUBGRAPH;

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINTS,
  cache: new InMemoryCache(),
});

const QueryPunks = () => {
  const {state, dispatch} = useGlobalState();
  const {primaryColor, secondaryColor} = useColors(state);
  const [getAssignedPunk, {loading, error, data}] = useLazyQuery(
    MOST_VALUABLE_PUNKS_QUERY,
  );

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [data]);

  return (
    <Col key={`${loading}`}>
      <Space direction="vertical" size="large">
        <StepButton
          onClick={() => getAssignedPunk()}
          icon={<PoweroffOutlined />}
          type="primary"
          loading={loading}
          secondary_color={secondaryColor}
          primary_color={primaryColor}
          size="large"
          autoFocus={false}
        >
          Display the 10 most valuable CryptoPunks
        </StepButton>
        {data ? (
          <Punks data={data.punks} />
        ) : error ? (
          <Alert
            message={<Text strong>We couldn&apos;t query the subgraph 😢</Text>}
            description={
              <Space direction="vertical">
                <div>Are you sure the subgraph was deployed?</div>
              </Space>
            }
            type="error"
            showIcon
            closable
          />
        ) : null}
      </Space>
    </Col>
  );
};

const Query = () => {
  if (!GRAPHQL_ENDPOINTS) {
    return (
      <Alert
        message="Make sure you have `NEXT_PUBLIC_LOCAL_SUBGRAPH` in your .env.local file."
        description="If you make a change to .env.local, you'll need to restart the server!"
        type="error"
        showIcon
      />
    );
  }

  return (
    <ApolloProvider client={client}>
      <QueryPunks />
    </ApolloProvider>
  );
};

export default Query;
