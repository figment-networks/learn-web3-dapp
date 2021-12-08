import {CHAINS, ChainPropT} from 'types';
import {getStaticPropsForChain} from 'utils/pages';
import Layout from 'components/shared/Layout';
import {TheGraphNear} from 'components/protocols';

export async function getStaticProps() {
  return getStaticPropsForChain(CHAINS.THE_GRAPH_NEAR);
}

const Protocol = (props: ChainPropT) => {
  const {markdown, chain} = props;
  return (
    <Layout markdown={markdown} chain={chain}>
      <TheGraphNear />
    </Layout>
  );
};

export default Protocol;
