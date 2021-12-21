import {CHAINS, ChainPropT} from 'types';
import {getStaticPropsForChain} from 'utils/pages';
import Layout from 'components/shared/Layout';
import {Avalanche} from 'components/protocols';
import NoSSR from 'react-no-ssr';

export async function getStaticProps() {
  return getStaticPropsForChain(CHAINS.AVALANCHE);
}

const Protocol = (props: ChainPropT) => {
  const {markdown, chain} = props;
  return (
    <NoSSR>
      <Layout markdown={markdown} chain={chain}>
        <Avalanche />
      </Layout>
    </NoSSR>
  );
};

export default Protocol;
