
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardOverview from '@/components/DashboardOverview';
import TasksModule from '@/components/TasksModule';
import FinanceModule from '@/components/FinanceModule';
import ScheduleModule from '@/components/ScheduleModule';
import AnalyticsModule from '@/components/AnalyticsModule';
import ChatModule from '@/components/ChatModule';
import LifeBlocksManager from '@/components/LifeBlocksManager';
import CustomLifeBlockModule from '@/components/CustomLifeBlockModule';
import { useLifeBlocks } from '@/hooks/useLifeBlocks';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [selectedLifeBlockId, setSelectedLifeBlockId] = useState<string | null>(null);
  const { lifeBlocks } = useLifeBlocks();

  const renderActiveModule = () => {
    if (activeModule.startsWith('lifeblock-')) {
      const lifeBlockId = activeModule.replace('lifeblock-', '');
      const lifeBlock = lifeBlocks.find(lb => lb.id === lifeBlockId);
      if (lifeBlock) {
        return <CustomLifeBlockModule lifeBlock={lifeBlock} />;
      }
    }

    switch (activeModule) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'tasks':
        return <TasksModule />;
      case 'finance':
        return <FinanceModule />;
      case 'schedule':
        return <ScheduleModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'chat':
        return <ChatModule />;
      case 'lifeblocks':
        return (
          <LifeBlocksManager
            onSelectLifeBlock={(lifeBlockId) => setActiveModule(`lifeblock-${lifeBlockId}`)}
          />
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        customLifeBlocks={lifeBlocks}
      />
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {renderActiveModule()}
        </div>
      </div>
    </div>
  );
};

export default Index;
