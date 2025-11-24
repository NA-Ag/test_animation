import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ToolMode } from './types';
import { CleanupView } from './views/CleanupView';
import { InbetweenView } from './views/InbetweenView';
import { ColorView } from './views/ColorView';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<ToolMode>(ToolMode.CLEANUP);

  const renderContent = () => {
    switch (currentMode) {
      case ToolMode.CLEANUP:
        return <CleanupView />;
      case ToolMode.INBETWEEN:
        return <InbetweenView />;
      case ToolMode.COLOR:
        return <ColorView />;
      default:
        return <CleanupView />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar currentMode={currentMode} onModeChange={setCurrentMode} />
      
      <main className="flex-1 ml-72 p-8 overflow-y-auto h-screen bg-grid-pattern">
        {renderContent()}
      </main>

      {/* Background pattern via inline styles or tailwind utility if config permitted, creating simple effect manually here */}
      <style>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, #18181b 1px, transparent 1px),
                            linear-gradient(to bottom, #18181b 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default App;
