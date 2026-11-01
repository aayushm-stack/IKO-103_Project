import React from 'react';
import { ShastraLensDrawer, ShastraLensDrawerProps } from '../Shastra/ShastraLensDrawer';

export type ShastraLensModalProps = ShastraLensDrawerProps;

/**
 * ShastraLensModal component wrapping the ShastraLensDrawer
 * to maintain complete compatibility across all feature imports.
 */
export const ShastraLensModal: React.FC<ShastraLensModalProps> = (props) => {
  return <ShastraLensDrawer {...props} />;
};

export default ShastraLensModal;
