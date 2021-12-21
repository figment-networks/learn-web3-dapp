import {useGlobalState} from 'context';
import {Space} from 'antd';
import styled from 'styled-components';
import {getStepId} from 'utils/context';
import {PROTOCOL_STEPS_ID} from 'types';
import Auth from '@figment-ceramic/components/auth';

const Nav = () => {
  const {state} = useGlobalState();
  const stepId = getStepId(state);

  return (
    <StepMenuBar>
      {stepId === PROTOCOL_STEPS_ID.CHAIN_CONNECTION ? (
        <Auth onlyConnect={true} />
      ) : (
        stepId !== PROTOCOL_STEPS_ID.PROJECT_SETUP && <Auth />
      )}
    </StepMenuBar>
  );
};

const StepMenuBar = styled(Space)`
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  flex-direction: row;
`;

export default Nav;
