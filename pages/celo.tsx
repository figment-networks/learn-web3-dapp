import {CHAINS, ChainPropT} from 'types';
import {Celo} from 'components/protocols';
import Layout from 'components/shared/Layout';
import {getStaticPropsForChain} from 'utils/pages';
import NoSSR from 'react-no-ssr';

export async function getStaticProps() {
  return getStaticPropsForChain(CHAINS.CELO);
}

const Protocol = (props: ChainPropT) => {
  const {markdown, chain} = props;
  return (
    <NoSSR>
      <Layout markdown={markdown} chain={chain}>
        <Celo />
      </Layout>
    </NoSSR>
  );
};

export default Protocol;
