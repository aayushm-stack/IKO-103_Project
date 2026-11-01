import React from 'react';
import { ShastraLensDrawer, ShastraLensDrawerProps } from './ShastraLensDrawer';

export type ShastraLensProps = ShastraLensDrawerProps;

export const ShastraLens: React.FC<ShastraLensProps> = (props) => {
  return <ShastraLensDrawer {...props} />;
};

export default ShastraLens;
