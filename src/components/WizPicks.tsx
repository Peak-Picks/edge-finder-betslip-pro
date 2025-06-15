
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Zap, BarChart3 } from 'lucide-react';
import { BestBets } from './BestBets';
import { PlayerProps } from './PlayerProps';
import { GameBasedPicks } from './GameBasedPicks';
import { BetSlipProvider } from './BetSlipContext';

export const WizPicks = () => {
  const [activeTab, setActiveTab] = useState('best-bets');

  return (
    <BetSlipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Wiz Picks</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger
              value="best-bets"
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex items-center gap-1"
            >
              <Target className="w-4 h-4" />
              Best Bets
            </TabsTrigger>
            <TabsTrigger
              value="game-based"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 flex items-center gap-1"
            >
              <BarChart3 className="w-4 h-4" />
              Game Picks
            </TabsTrigger>
            <TabsTrigger
              value="player-props"
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex items-center gap-1"
            >
              <Zap className="w-4 h-4" />
              Player Props
            </TabsTrigger>
          </TabsList>
          <TabsContent value="best-bets" className="mt-4">
            <BestBets />
          </TabsContent>
          <TabsContent value="game-based" className="mt-4">
            <GameBasedPicks />
          </TabsContent>
          <TabsContent value="player-props" className="mt-4">
            <PlayerProps />
          </TabsContent>
        </Tabs>
      </div>
    </BetSlipProvider>
  );
};
