
import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PlayerPropInsights } from './PlayerPropInsights';
import { PlayerDetailPage } from './PlayerDetailPage';
import { LeagueTabsHeader } from './LeagueTabsHeader';
import { PropCard } from './PropCard';
import { propsByLeague } from '../data/propsData';

export const Props = () => {
  const [selectedLeague, setSelectedLeague] = useState('nba');
  const [selectedProp, setSelectedProp] = useState(null);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetailOpen, setPlayerDetailOpen] = useState(false);

  const handlePropClick = (playerData: any, propData: any) => {
    setSelectedProp({
      player: playerData.player,
      team: playerData.team,
      prop: propData.type,
      line: propData.line,
      type: "Over",
      odds: propData.odds,
      edge: propData.edge,
      projected: propData.line + (propData.edge * 0.1),
      confidence: propData.edge >= 10 ? "high" : propData.edge >= 5 ? "medium" : "low"
    });
    setInsightsOpen(true);
  };

  const handlePlayerDetailClick = (playerData: any) => {
    setSelectedPlayer({
      name: playerData.player,
      team: playerData.team,
      matchup: playerData.matchup
    });
    setPlayerDetailOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
        <LeagueTabsHeader 
          selectedLeague={selectedLeague}
          onLeagueChange={setSelectedLeague}
        />

        <div className="p-4">
          <Tabs value={selectedLeague} className="w-full">
            <TabsContent value={selectedLeague} className="mt-0">
              <div className="space-y-4">
                {propsByLeague[selectedLeague as keyof typeof propsByLeague].map((playerData, playerIndex) => (
                  <PropCard
                    key={playerIndex}
                    playerData={playerData}
                    onPlayerDetailClick={handlePlayerDetailClick}
                    onPropClick={handlePropClick}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PlayerPropInsights 
        prop={selectedProp}
        open={insightsOpen}
        onOpenChange={setInsightsOpen}
      />

      <PlayerDetailPage
        player={selectedPlayer}
        open={playerDetailOpen}
        onOpenChange={setPlayerDetailOpen}
      />
    </>
  );
};
