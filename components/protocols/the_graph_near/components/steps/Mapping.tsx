import React, {useEffect, useState} from 'react';
import {Col, Alert, Space, Typography, Input} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {useGlobalState} from 'context';
import {StepButton} from 'components/shared/Button.styles';
import {useColors} from 'hooks';
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';
import {DID_QUERY_MAPPING} from '@figment-the-graph-near/graphql/query';

const {Text} = Typography;
let client: any;

const Mapping = () => {
  const {state, dispatch} = useGlobalState();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [endpoint, setEndPoint] = useState();
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {primaryColor, secondaryColor} = useColors(state);

  useEffect(() => {
    console.log('endpoint', endpoint);

    if (endpoint) {
      client = new ApolloClient({
        uri: endpoint,
        cache: new InMemoryCache(),
      });
    }

    if (isValid) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [endpoint, isValid, setIsValid]);

  async function getData() {
    setFetching(true);
    setIsValid(false);
    setError(null);
    try {
      let thisData = await client.query({query: gql(DID_QUERY_MAPPING)});
      console.log('thisdata', thisData);
      if (thisData) {
        setIsValid(true);
      } else {
        setError('error getting subgraph response');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setFetching(false);
    }
  }

  function onEntityChange(event: any) {
    setEndPoint(event.target.value.toLowerCase());
  }

  return (
    <Col key={`${fetching}`}>
      <Space direction="vertical" size="large">
        <Text>Enter your subgraph endpoint (from your dashboard).</Text>
        <Input onChange={onEntityChange} />
        <StepButton
          type="primary"
          icon={<PoweroffOutlined />}
          onClick={() => getData()}
          loading={fetching}
          secondary_color={secondaryColor}
          primary_color={primaryColor}
          size="large"
          autoFocus={false}
        >
          Check subgraph deployment
        </StepButton>
        {isValid ? (
          <>
            <Alert
              message={<Text strong>We found a deployed subgraph! 🎉</Text>}
              description={
                <Space direction="vertical">
                  <div>Now we can realize the fruits of our labour.</div>
                  <div>
                    Let&apos;s tweak the subgraph query to display some relevant
                    information about the accounts registered. On to the next
                    step next step!
                  </div>
                </Space>
              }
              type="success"
              showIcon
            />
          </>
        ) : error ? (
          <Alert
            message={<Text strong>We couldn&apos;t find a subgraph 😢</Text>}
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

export default Mapping;
