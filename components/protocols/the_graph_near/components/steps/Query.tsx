import React, {useState, useEffect} from 'react';
import {Alert, Col, Space, Typography, List} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useLazyQuery,
} from '@apollo/client';
import DID_QUERY from '@figment-the-graph-near/graphql/query';
import {useGlobalState} from 'context';
import {useColors} from 'hooks';
import {StepButton} from 'components/shared/Button.styles';
//import Punks from '@figment-the-graph-near/components/punks';

const {Text} = Typography;

//const endpoint = process.env.SUBGRAPH;

const endpoint =
  'https://api.thegraph.com/subgraphs/name/aluhning/did-registry';

const client = new ApolloClient({
  uri: endpoint,
  cache: new InMemoryCache(),
});

const QueryAccounts = () => {
  const {state, dispatch} = useGlobalState();
  const [allRegistrations, setAllRegistrations] = useState(['']);
  const {primaryColor, secondaryColor} = useColors(state);
  const [getDids, {loading, error, data}] = useLazyQuery(DID_QUERY);

  useEffect(() => {
    if (data) {
      let registrations = [''];
      let z = 0;
      while (z < data.data.accounts.length) {
        let registryData = JSON.parse(data.data.accounts[z].log[0]);
        console.log('reg registryData', registryData);
        if (registryData.EVENT_JSON.event == 'putDID') {
          console.log('reg here');
          registrations.push(registryData);
        }
        z++;
      }
      setAllRegistrations(registrations);
      console.log('registrations', registrations);
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [data]);

  return (
    <Col key={`${loading}`}>
      <Space direction="vertical" size="large">
        <StepButton
          onClick={() => getDids()}
          icon={<PoweroffOutlined />}
          type="primary"
          loading={loading}
          secondary_color={secondaryColor}
          primary_color={primaryColor}
          size="large"
          autoFocus={false}
        >
          Display 10 NEAR accounts and their DIDs.
        </StepButton>
        {allRegistrations ? (
          <List
            header={<div>Header</div>}
            footer={<div>Footer</div>}
            bordered
            dataSource={allRegistrations}
            renderItem={(item) => {
              console.log('items', item);
              return (
                <List.Item>
                  <Typography.Text mark>[ITEM]</Typography.Text>
                  {item}
                </List.Item>
              );
            }}
          />
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
  if (!endpoint) {
    return (
      <Alert
        message="Make sure you have `SUBGRAPH` in your .env.local file."
        description="If you make a change to .env.local, you'll need to restart the server!"
        type="error"
        showIcon
      />
    );
  }

  return (
    <ApolloProvider client={client}>
      <QueryAccounts />
    </ApolloProvider>
  );
};

export default Query;
