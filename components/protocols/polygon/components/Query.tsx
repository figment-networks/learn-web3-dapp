import {useState, useEffect} from 'react';
import {Alert, Col, Space, Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import dynamic from 'next/dynamic';
const DynamicReactJson = dynamic(() => import('react-json-view'), {ssr: false});

import {query} from '@figment-polygon/challenges';
import {useGlobalState} from 'context';
import {QueryT} from 'types';

const Query = () => {
  const {dispatch} = useGlobalState();

  const [queryData, setQueryData] = useState<QueryT | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (queryData) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [queryData, setQueryData]);

  const getQuery = async () => {
    setFetching(true);
    setError(undefined);
    setQueryData(undefined);
    const {error, data} = await query();
    if (error) {
      setError(error);
    } else {
      setQueryData(data);
    }
    setFetching(false);
  };

  return (
    <Col>
      <Space direction="vertical" size="large">
        <Space direction="vertical" style={{overflow: 'hidden'}} size="large">
          <Button
            type="primary"
            icon={<PoweroffOutlined />}
            onClick={getQuery}
            loading={fetching}
            size="large"
          >
            Query Polygon
          </Button>
          {queryData ? (
            <>
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  overflow: 'hidden',
                  overflowY: 'scroll',
                  paddingRight: '17px',
                  boxSizing: 'content-box',
                }}
              >
                <DynamicReactJson
                  src={queryData}
                  collapsed={false}
                  name={'query data'}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  collapseStringsAfterLength={65}
                />
              </div>
            </>
          ) : error ? (
            <Alert message={error} type="error" showIcon />
          ) : (
            <Alert message="Please Complete the code." type="error" showIcon />
          )}
        </Space>
      </Space>
    </Col>
  );
};

export default Query;
