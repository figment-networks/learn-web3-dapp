import React, {useState, useEffect} from 'react';
import {Alert, Col, Space, Typography, List, Input, Avatar} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';
import {useGlobalState} from 'context';
import {useColors} from 'hooks';
import {StepButton} from 'components/shared/Button.styles';
import {CeramicClient} from '@ceramicnetwork/http-client';
import {IDX} from '@ceramicstudio/idx';
import {DID_QUERY} from '@figment-the-graph-near/graphql/query';

const {Text} = Typography;

const API_URL = 'https://ceramic-node.vitalpointai.com';
const ceramicClient = new CeramicClient(API_URL);
let rootAliases = {
  profile: 'kjzl6cwe1jw145zawd1py0ezd909prn6b6kcw1upuihmr60rkbz2fb38ufykrrp',
  daoProfile: 'kjzl6cwe1jw148ijssckiq3v6nrpbev2t68gp2lb1x5t6ldt9msftrqi2hmp8hz',
};
const appIdx = new IDX({ceramic: ceramicClient, aliases: rootAliases});

let client: any;

const QueryAccounts = () => {
  const {state, dispatch} = useGlobalState();
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [data, setData] = useState<any>();
  const [endpoint, setEndPoint] = useState();
  const {primaryColor, secondaryColor} = useColors(state);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    console.log('endpoint', endpoint);

    if (endpoint) {
      client = new ApolloClient({
        uri: endpoint,
        cache: new InMemoryCache(),
      });
    }

    async function fetchData() {
      let registrations: any = [];
      if (data) {
        let z = 0;
        while (z < data.data.logs.length) {
          let object;
          let result: any = await appIdx.get(
            'daoProfile',
            data.data.logs[z].did,
          );
          if (result) {
            object = {
              avatar: result.avatar,
              registryData: data.data.logs[z],
            };
          }

          let xresult: any = await appIdx.get('profile', data.data.logs[z].did);
          if (xresult) {
            object = {
              avatar: xresult.avatar,
              registryData: data.data.logs[z],
            };
          }
          registrations.push(object);
          z++;
        }
        setAllRegistrations(registrations);

        dispatch({
          type: 'SetIsCompleted',
        });
      }
    }

    fetchData().then((res) => {
      setLoading(false);
    });
  }, [endpoint, data]);

  async function getData() {
    let thisData = await client.query({query: gql(DID_QUERY)});
    console.log('data', thisData);
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
            renderItem={(item: any) => {
              console.log('items', item);
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.registryData.accountId}
                    description={item.registryData.did}
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
  return <QueryAccounts />;
};

export default Query;
