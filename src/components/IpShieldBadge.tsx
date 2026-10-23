import React from 'react';
import { IpShieldBadge as IpShieldBadgeJsx } from './IpShieldBadge.jsx';

export interface IpShieldBadgeProps {
  className?: string;
}

export const IpShieldBadge: React.FC<IpShieldBadgeProps> = (props) => {
  return <IpShieldBadgeJsx {...props} />;
};

export default IpShieldBadge;
