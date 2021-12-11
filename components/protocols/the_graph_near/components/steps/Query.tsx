import React, {useState, useEffect} from 'react';
import {Alert, Col, Space, Typography, List, Input, Avatar} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {
  ApolloClient,
  InMemoryCache,
  gql,
  ApolloProvider,
  useLazyQuery,
} from '@apollo/client';
import DID_QUERY from '@figment-the-graph-near/graphql/query';
import {useGlobalState} from 'context';
import {useColors} from 'hooks';
import {StepButton} from 'components/shared/Button.styles';
import {CeramicClient} from '@ceramicnetwork/http-client';
import {IDX} from '@ceramicstudio/idx';

//import Punks from '@figment-the-graph-near/components/punks';

const {Text} = Typography;

const API_URL = 'https://ceramic-node.vitalpointai.com';
const ceramicClient = new CeramicClient(API_URL);
let rootAliases = {
  profile: 'kjzl6cwe1jw145zawd1py0ezd909prn6b6kcw1upuihmr60rkbz2fb38ufykrrp',
  daoProfile: 'kjzl6cwe1jw148ijssckiq3v6nrpbev2t68gp2lb1x5t6ldt9msftrqi2hmp8hz',
};
const appIdx = new IDX({ceramic: ceramicClient, aliases: rootAliases});

//const endpoint = process.env.SUBGRAPH;

const QueryAccounts = () => {
  const {state, dispatch} = useGlobalState();
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [logo, setLogo] = useState();
  const [data, setData] = useState();
  const [endpoint, setEndPoint] = useState();
  const {primaryColor, secondaryColor} = useColors(state);
  const [loading, setLoading] = useState(true);
  //const [{loading, error, data}] = useLazyQuery(DID_QUERY);

  const DID_QUERY = `
    query{
        accounts{
            id
            log
        }
    }
    `;

  const client = new ApolloClient({
    uri: endpoint,
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    async function fetchData() {
      if (data) {
        let registrations = [];
        let z = 0;
        console.log('data', data);
        while (z < data.data.accounts.length) {
          let registryData = JSON.parse(data.data.accounts[z].log[0]);
          console.log('reg registryData', registryData);
          if (registryData.EVENT_JSON.event == 'putDID') {
            console.log('reg here');
            let object;
            let result = await appIdx.get(
              'daoProfile',
              registryData.EVENT_JSON.data.did,
            );
            if (result) {
              object = {
                avatar: result.avatar,
                registryData: registryData,
              };
            }

            let xresult = await appIdx.get(
              'profile',
              registryData.EVENT_JSON.data.did,
            );
            if (xresult) {
              object = {
                avatar: xresult.avatar,
                registryData: registryData,
              };
            }

            registrations.push(object);
          }
          z++;
        }
        setAllRegistrations(registrations);
        console.log('registrations', registrations);
        dispatch({
          type: 'SetIsCompleted',
        });
      }
    }

    fetchData().then((res) => {
      setLoading(false);
    });
  }, [data]);

  async function getData() {
    let thisData = await client.query({query: gql(DID_QUERY)});
    setData(thisData);
  }

  function onEntityChange(event: any) {
    setEndPoint(event.target.value.toLowerCase());
  }

  return (
    <Col key={`${loading}`}>
      <Space
        direction="vertical"
        size="large"
        style={{overflowWrap: 'break-word'}}
      >
        <Text>Enter your subgraph endpoint (from your dashboard).</Text>
        <Input onChange={onEntityChange} />
        <StepButton
          onClick={() => getData()}
          icon={<PoweroffOutlined />}
          type="primary"
          loading={loading}
          secondary_color={secondaryColor}
          primary_color={primaryColor}
          size="large"
          autoFocus={false}
        >
          Display NEAR accounts and their DIDs.
        </StepButton>
        {allRegistrations ? (
          <List
            itemLayout="horizontal"
            bordered
            dataSource={allRegistrations}
            renderItem={(item) => {
              console.log('items', item);
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.registryData.EVENT_JSON.data.accountId}
                    description={item.registryData.EVENT_JSON.data.did}
                  />
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
  // if (!endpoint) {
  //   return (
  //     <Alert
  //       message="Make sure you have `SUBGRAPH` in your .env.local file."
  //       description="If you make a change to .env.local, you'll need to restart the server!"
  //       type="error"
  //       showIcon
  //     />
  //   );
  // }

  return <QueryAccounts />;
};

export default Query;
