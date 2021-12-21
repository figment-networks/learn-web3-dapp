import Head from 'next/head';

import {useGlobalState} from 'context';
import {getChainLabel} from 'utils/context';

export default function HeadLayout() {
  const {state} = useGlobalState();
  const label = getChainLabel(state);
  return (
    <Head>
      <title>{`Figment Learn - ${label} Pathway`}</title>
      <meta
        name="description"
        content="Figment Learn's Web 3 education courses"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
