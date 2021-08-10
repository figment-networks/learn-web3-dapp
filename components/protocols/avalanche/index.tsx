import { useState } from "react";
import { Row, Typography } from 'antd';

import Sidebar from "components/shared/Sidebar";
import Step from "components/shared/Step";
import { ChainType } from "types/types";
import { useSteps } from "hooks/steps-hooks";
import Connect from "./steps/Connect";
import Account from "./steps/Account";
import Query from "./steps/Query";
import TransferX from "./steps/Transfer_X";
import { AvalancheKeypairType } from "types/avalanche-types";

const { Text, Paragraph } = Typography;

const Chain = ({ chain }: { chain: ChainType }) => {
	const [keypair, setKeypair] = useState<AvalancheKeypairType | null>(null);

	const { steps } = chain

	const {
		next,
		prev,
		stepIndex,
		step,
		isFirstStep,
		isLastStep
	} = useSteps(steps);

	return (
		<Row>
			<Sidebar
				chain={chain}
				steps={steps}
				stepIndex={stepIndex}
			/>
			<Step
				chain={chain}
				step={step}
				isFirstStep={isFirstStep}
				isLastStep={isLastStep}
				prev={prev}
				next={next}
				body={
					<>
						{step.id === "connect" && <Connect />}
						{step.id === "account" && <Account keypair={keypair} setKeypair={setKeypair} />}
						{step.id === "query" && <Query />}
						{step.id === "transferX" && <TransferX keypair={keypair} />}
					</>
				}
				nav={<Nav keypair={keypair} />}
			/>
		</Row>
	);
}

const Nav = ({ keypair }: { keypair : AvalancheKeypairType | null}) => {
	if (!keypair) return null;

	const address = keypair.addressString;
	const addressToDisplay = `${address.slice(0,6)}...${address.slice(-6)}`;

	return (
		<div style={{ position: "fixed", top: 20, right: 60 }}>
			<Paragraph copyable={{ text: address }}>
				<Text code>{addressToDisplay}</Text>
			</Paragraph>
		</div>
	)
}

export default Chain