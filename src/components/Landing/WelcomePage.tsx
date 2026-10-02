import React, { useEffect } from 'react';
import { UnifiedDeporversoExperience } from './UnifiedDeporversoExperience';
import { Tenant, UserRole } from '../../types';

interface WelcomePageProps {
  onNavigateTab: (tab: string) => void;
  onEnterFullPlatform?: (tabKey?: string) => void;
  onOpenAffiliation?: () => void;
  onAddTenant?: (tenant: Omit<Tenant, 'id' | 'created_at'>) => void;
  setUserRole?: (role: UserRole) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onNavigateTab,
  onEnterFullPlatform,
  onOpenAffiliation,
  onAddTenant
}) => {
  const handleEnter = (tabKey: string = 'league') => {
    if (onEnterFullPlatform) {
      onEnterFullPlatform(tabKey);
    } else {
      onNavigateTab(tabKey);
    }
  };

  return (
    <div className="w-full min-h-screen relative">
      <UnifiedDeporversoExperience
        onNavigateTab={handleEnter}
        onEnterPlatform={() => handleEnter('league')}
        onAddTenant={onAddTenant}
        onRequestDemo={() => {
          if (onOpenAffiliation) {
            onOpenAffiliation();
          } else {
            handleEnter('league');
          }
        }}
        onStartNow={() => {
          if (onOpenAffiliation) {
            onOpenAffiliation();
          } else {
            handleEnter('league');
          }
        }}
      />
    </div>
  );
};

