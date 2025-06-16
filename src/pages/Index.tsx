import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { WizPicks } from '@/components/WizPicks';
import { Props } from '@/components/Props';
import { TrendingParlays } from '@/components/TrendingParlays';
import { BankrollTracker } from '@/components/BankrollTracker';
import { GameLines } from '@/components/GameLines';
import { PlayerPropAnalyzer } from '@/components/PlayerPropAnalyzer';
import { BetBuilder } from '@/components/BetBuilder';
import { DiscoverPage } from '@/components/DiscoverPage';
import { ProfilePage } from '@/components/ProfilePage';
import { BettingGuide } from '@/components/BettingGuide';
import { TrendingUp, Target, BarChart3, Wallet, Zap, RefreshCw } from 'lucide-react';
import TutorialModal from '@/components/TutorialModal';
import { BetSlipProvider, useBetSlipContext } from "@/components/BetSlipContext";
import { apiManager } from '@/services/apiManager';
import { createOddsApiService } from '@/services/oddsApiService';

const THREE_WEEKS_MS = 21 * 24 * 60 * 60 * 1000;

// Create an instance of the odds API service
const oddsApiService = createOddsApiService(import.meta.env.VITE_ODDS_API_KEY || '');

const HomeContent = ({ currentView, setCurrentView }: { currentView: string; setCurrentView: (view: string) => void }) => {
  const { savedBetSlips } = useBetSlipContext();
  const [refreshing, setRefreshing] = useState(false);

  const calculateROI = () => {
    const settled = savedBetSlips.filter(slip => slip.status !== 'pending');
    const totalWagered = settled.reduce((sum, slip) => sum + parseFloat(slip.amount), 0);
    const totalReturns = settled.reduce((sum, slip) => sum + (slip.actualPayout || 0), 0);
    const profit = totalReturns - totalWagered;
    const roi = totalWagered > 0 ? (profit / totalWagered) * 100 : 0;
    return roi;
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      console.log('Refreshing API data using apiManager...');
      
      // Use the new apiManager for refreshing data
      const result = await apiManager.manualRefresh();
      
      if (result.success) {
        console.log(`✅ ${result.message} (${result.dataCount} items)`);
      } else {
        console.error(`❌ ${result.message}`);
      }
      
    } catch (error) {
      console.error('Error refreshing API data:', error);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  };

  const roi = calculateROI();

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
              <Badge 
                variant="secondary" 
                className={`${roi >= 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}
              >
                {roi >= 0 ? '+' : ''}{roi.toFixed(1)}% ROI
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                disabled={refreshing}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
            </div>
          </div>

          <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger 
                value="wiz-picks" 
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex items-center gap-1 text-xs"
              >
                <Target className="w-3 h-3" />
                Wiz Picks
              </TabsTrigger>
              <TabsTrigger 
                value="props" 
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex items-center gap-1 text-xs"
              >
                <Zap className="w-3 h-3" />
                Props
              </TabsTrigger>
              <TabsTrigger 
                value="game-lines" 
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex items-center gap-1 text-xs"
              >
                <BarChart3 className="w-3 h-3" />
                Lines
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
          <TabsContent value="wiz-picks" className="mt-2">
            <WizPicks />
          </TabsContent>
          <TabsContent value="props" className="mt-2">
            <Props onRefreshData={handleRefreshData} />
          </TabsContent>
          <TabsContent value="game-lines" className="mt-2">
            <GameLines />
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
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('wiz-picks');
  const [showTutorial, setShowTutorial] = useState(false);

  // Check tutorial rules on first render
  useState(() => {
    const seen = localStorage.getItem('wizPicksTutorialSeen');
    const lastSeen = localStorage.getItem('wizPicksTutorialLastSeen');
    let shouldShow = false;

    if (!seen || !lastSeen) {
      shouldShow = true;
    } else {
      const now = Date.now();
      const last = parseInt(lastSeen, 10);
      if (isNaN(last) || now - last > THREE_WEEKS_MS) {
        shouldShow = true;
      }
    }
    setShowTutorial(shouldShow);
  });

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContent currentView={currentView} setCurrentView={setCurrentView} />;
      case 'betslip':
        return <BetBuilder />;
      case 'discover':
        return <DiscoverPage />;
      case 'guide':
        return <BettingGuide />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <TutorialModal isOpen={showTutorial} onClose={handleTutorialClose} />
      <BetSlipProvider>
        {renderContent()}
      </BetSlipProvider>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
