
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { BestBets } from '@/components/BestBets';
import { PlayerProps } from '@/components/PlayerProps';
import { TrendingParlays } from '@/components/TrendingParlays';
import { BankrollTracker } from '@/components/BankrollTracker';
import { PlayerPropAnalyzer } from '@/components/PlayerPropAnalyzer';
import { BetBuilder } from '@/components/BetBuilder';
import { DiscoverPage } from '@/components/DiscoverPage';
import { ProfilePage } from '@/components/ProfilePage';
import { TrendingUp, Target, Zap, Wallet } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('best-bets');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      EdgeBet Pro
                    </h1>
                    <p className="text-slate-400 text-sm">Smart betting insights</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      +12.3% ROI
                    </Badge>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
                  </div>
                </div>

                <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700/50">
                    <TabsTrigger 
                      value="best-bets" 
                      className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex items-center gap-1 text-xs"
                    >
                      <Target className="w-3 h-3" />
                      Best Bets
                    </TabsTrigger>
                    <TabsTrigger 
                      value="player-props" 
                      className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex items-center gap-1 text-xs"
                    >
                      <Zap className="w-3 h-3" />
                      Props
                    </TabsTrigger>
                    <TabsTrigger 
                      value="parlays" 
                      className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex items-center gap-1 text-xs"
                    >
                      <TrendingUp className="w-3 h-3" />
                      Parlays
                    </TabsTrigger>
                    <TabsTrigger 
                      value="bankroll" 
                      className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex items-center gap-1 text-xs"
                    >
                      <Wallet className="w-3 h-3" />
                      Tracker
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 py-2">
              <Tabs value={currentView} className="w-full">
                <TabsContent value="best-bets" className="mt-2">
                  <BestBets />
                </TabsContent>
                <TabsContent value="player-props" className="mt-2">
                  <PlayerProps />
                </TabsContent>
                <TabsContent value="parlays" className="mt-2">
                  <TrendingParlays />
                </TabsContent>
                <TabsContent value="bankroll" className="mt-2">
                  <BankrollTracker />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        );
      case 'betslip':
        return <BetBuilder />;
      case 'discover':
        return <DiscoverPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
