
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeagueTabsHeaderProps {
  selectedLeague: string;
  onLeagueChange: (league: string) => void;
}

export const LeagueTabsHeader = ({ selectedLeague, onLeagueChange }: LeagueTabsHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
      <h1 className="text-xl font-bold mb-4">All Player Props</h1>
      
      <Tabs value={selectedLeague} onValueChange={onLeagueChange}>
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger 
            value="nba" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            NBA
          </TabsTrigger>
          <TabsTrigger 
            value="nfl" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            NFL
          </TabsTrigger>
          <TabsTrigger 
            value="mlb" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            MLB
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
