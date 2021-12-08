import CryptopunksData from 'contracts/the_graph/CryptopunksData.abi.json';
import detectEthereumProvider from '@metamask/detect-provider';
import React, {useEffect, useState} from 'react';
import {toEther} from '@figment-the-graph/lib';
import {PunkdataT} from '@figment-the-graph/types';
import styled from 'styled-components';
import {ethers} from 'ethers';
import {Card, Row, Space, Typography} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import * as dayjs from 'dayjs';

const PUNK_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_PUNK_DATA_CONTRACT_ADDRESS as string;

const {Text} = Typography;

const {Meta} = Card;

type providerT = ethers.providers.ExternalProvider;

declare let window: {
  ethereum: providerT;
};

const PunkSvg = ({
  svgString,
  index,
  size = 100,
}: {
  svgString: string;
  index: number;
  size?: number;
}) => {
  return (
    <PunkImageWrapper>
      <PunkIndex>{index + 1}</PunkIndex>
      <PunkImg
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgString ?? '')}`}
        width={size}
        height={size}
      />
    </PunkImageWrapper>
  );
};

const DisplayedPunk = ({
  index,
  data,
  loading,
}: {
  index: number;
  data: PunkdataT;
  loading: boolean;
}) => {
  return (
    <StyledCard
      loading={loading}
      cover={<PunkSvg index={index} svgString={data?.svgString || ''} />}
    >
      <Meta
        title={`#${data.index}`}
        description={
          <Space direction="vertical">
            <Text>{toEther(data.value)} Ξ</Text>
            <Traits>{data.traits}</Traits>
            <Date>{dayjs.unix(data.date).format('MMM D, YYYY')}</Date>
          </Space>
        }
      />
    </StyledCard>
  );
};

const Punks = ({data}: {data: PunkdataT[]}) => {
  const [loading, setLoading] = useState(false);
  const [punksData, setPunksData] = useState<PunkdataT[] | undefined>(
    undefined,
  );

  const fecthPunkData = async (
    contract: ethers.Contract,
    punkData: PunkdataT,
  ) => {
    try {
      const index = parseFloat(punkData.index);
      const svgString = await contract.punkImageSvg(index);
      const traits = await contract.punkAttributes(index);
      return {
        ...punkData,
        svgString: svgString.slice(24),
        traits,
      };
    } catch (error) {
      return punkData;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setPunksData(undefined);
      setLoading(true);
      try {
        const provider = (await detectEthereumProvider()) as providerT;

        if (provider) {
          await provider.request?.({
            method: 'eth_requestAccounts',
          });

          const web3provider = new ethers.providers.Web3Provider(
            window.ethereum,
          );
          const contract = new ethers.Contract(
            PUNK_CONTRACT_ADDRESS,
            CryptopunksData,
            web3provider,
          );
          const promises = data.map((punk: PunkdataT) =>
            fecthPunkData(contract, punk),
          );
          return await Promise.all(promises);
        } else {
          alert('Please install Metamask at https://metamask.io');
        }
      } catch (error) {
        alert(`Something went wrong:, ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData().then((data) => setPunksData(data));
  }, []);

  console.log(punksData);

  return (
    <Row>
      {punksData ? (
        <Space direction="vertical">
          <ResultsTitle>
            Most valuable CryptoPunks since Block #13100000 (Aug-26-2021)
          </ResultsTitle>
          <Row>
            {punksData.map((punk: PunkdataT, index: number) => {
              return (
                <DisplayedPunk
                  data={punk}
                  key={punk.id}
                  loading={loading}
                  index={index}
                />
              );
            })}
          </Row>
        </Space>
      ) : loading ? (
        <LoadingOutlined style={{fontSize: '64px'}} spin />
      ) : null}
    </Row>
  );
};

const ResultsTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Traits = styled.div`
  font-size: 12px;
`;

const Date = styled.div`
  font-size: 12px;
  color: #aaa;
`;

const PunkImageWrapper = styled.div`
  position: relative;
`;

const PunkIndex = styled.div`
  position: absolute;
  top: 10;
  left: 10;
  font-size: 20px;
  font-weight: 600;
  color: #5943d0;
`;

const PunkImg = styled.img`
  background: #dbdbdb;
  width: 100%;
`;

const StyledCard = styled(Card)`
  width: 200px;
  margin: 0 20px 20px 0;
`;

export default Punks;
