import {ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons';
import {useGlobalState} from 'context';
import {getStepId} from 'utils/context';
import {FOOTER_HEIGHT} from 'lib/constants';
import styled from 'styled-components';
import {Col, Row} from 'antd';
import {useSteps, useColors} from 'hooks';
import {NextButton, PrevButton} from '../Button.styles';

const Footer = () => {
  const {state, dispatch} = useGlobalState();
  const {
    next,
    prev,
    isFirstStep,
    isLastStep,
    justify,
    nextStepTitle,
    previousStepTitle,
    isCompleted,
  } = useSteps(state, dispatch);

  const {primaryColor, secondaryColor} = useColors(state);

  return (
    <Col span={24}>
      <StepFooter justify={justify} align="middle">
        {!isFirstStep && (
          <PrevButton
            size="large"
            style={{marginRight: '8px'}}
            onClick={() => prev()}
            icon={<ArrowLeftOutlined />}
          >
            {previousStepTitle}
          </PrevButton>
        )}
        {!isLastStep && (
          <NextButton
            key={getStepId(state)}
            size="large"
            type="primary"
            onClick={() => next()}
            secondary_color={secondaryColor}
            primary_color={primaryColor}
            disabled={!isCompleted}
          >
            <Row align="middle">
              {nextStepTitle}
              <ArrowRightOutlined size={20} style={{marginLeft: '6px'}} />
            </Row>
          </NextButton>
        )}
      </StepFooter>
    </Col>
  );
};

const StepFooter = styled(Row)`
  padding: 0 40px;
  height: ${FOOTER_HEIGHT}px;
  background: #f5f5f5;
  border-top: solid 2px black;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default Footer;
