import {CHAINS, ChainPropT} from 'types';
import {getStaticPropsForChain} from 'utils/pages';
import Layout from 'components/shared/Layout';
import {Solana} from 'components/protocols';
import NoSSR from 'react-no-ssr';

export async function getStaticProps() {
  return getStaticPropsForChain(CHAINS.SOLANA);
}

const Protocol = (props: ChainPropT) => {
  const {markdown, chain} = props;
  return (
    <NoSSR>
      <Layout markdown={markdown} chain={chain}>
        <Solana />
      </Layout>
    </NoSSR>
  );
};

export default Protocol;
