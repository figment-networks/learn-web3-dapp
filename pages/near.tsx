import {getStaticPropsForChain} from 'utils/pages';
import {CHAINS, ChainPropT} from 'types';
import Layout from 'components/shared/Layout';
import {Near} from 'components/protocols';
import NoSSR from 'react-no-ssr';

export async function getStaticProps() {
  return getStaticPropsForChain(CHAINS.NEAR);
}

const Protocol = (props: ChainPropT) => {
  const {markdown, chain} = props;
  return (
    <NoSSR>
      <Layout markdown={markdown} chain={chain}>
        <Near />
      </Layout>
    </NoSSR>
  );
};

export default Protocol;
