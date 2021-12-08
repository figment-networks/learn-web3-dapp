import * as Steps from '@figment-the-graph-near/components/steps';
import {getStepId} from 'utils/context';
import {useGlobalState} from 'context';
import {PROTOCOL_STEPS_ID} from 'types';

const TheGraphNear: React.FC = () => {
  const {state} = useGlobalState();
  const stepId = getStepId(state);

  return (
    <>
      {stepId === PROTOCOL_STEPS_ID.PROJECT_SETUP}
      {stepId === PROTOCOL_STEPS_ID.GRAPH_NODE && <Steps.Node />}
      {stepId === PROTOCOL_STEPS_ID.SUBGRAPH_SCAFFOLD && <Steps.Subgraph />}
      {stepId === PROTOCOL_STEPS_ID.SUBGRAPH_MANIFEST && <Steps.Manifest />}
      {stepId === PROTOCOL_STEPS_ID.SUBGRAPH_SCHEMA && <Steps.Entity />}
      {stepId === PROTOCOL_STEPS_ID.SUBGRAPH_MAPPINGS && <Steps.Mapping />}
      {stepId === PROTOCOL_STEPS_ID.SUBGRAPH_QUERY && <Steps.Query />}
    </>
  );
};

export default TheGraphNear;
