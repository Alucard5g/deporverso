import React from 'react';
import { MainExperience } from '../immersive/MainExperience';
import { Tenant, UserRole } from '../../types';

interface WelcomePageProps {
  onNavigateTab: (tab: string) => void;
  onEnterFullPlatform?: (tabKey?: string) => void;
  onOpenAffiliation?: () => void;
  onAddTenant?: (tenant: Omit<Tenant, 'id' | 'created_at'>) => void;
  setUserRole?: (role: UserRole) => void;
  isSuperAdminAuth?: boolean;
  onSuperAdminAuthSuccess?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onNavigateTab,
  onEnterFullPlatform,
  onOpenAffiliation
}) => {
  const handleEnter = (tabKey: string = 'league') => {
    if (onEnterFullPlatform) {
      onEnterFullPlatform(tabKey);
    } else {
      onNavigateTab(tabKey);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <MainExperience
        onEnterPlatform={() => handleEnter('league')}
        onOpenOnboarding={() => {
          if (onOpenAffiliation) {
            onOpenAffiliation();
          } else {
            handleEnter('league');
          }
        }}
        onSelectTab={(tabKey) => {
          handleEnter(tabKey);
        }}
      />
    </div>
  );
};
