import React from 'react';
import { OnboardingFlow, type OnboardingFlowProps } from '../Onboarding/OnboardingFlow';

export type OnboardingProps = OnboardingFlowProps;

/**
 * Onboarding wrapper delegating directly to the 2-page OnboardingFlow component.
 * Preserves backwards compatibility for all existing imports across BrahmaPath.
 */
export const Onboarding: React.FC<OnboardingProps> = (props) => {
  return <OnboardingFlow {...props} />;
};

export default Onboarding;
