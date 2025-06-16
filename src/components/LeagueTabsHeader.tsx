
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeagueTabsHeaderProps {
  selectedLeague: string;
  onLeagueChange: (league: string) => void;
}

export const LeagueTabsHeader = ({ selectedLeague, onLeagueChange }: LeagueTabsHeaderProps) => {
  return (
    <div className="mb-4">
      <Tabs value={selectedLeague} onValueChange={onLeagueChange}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700/50">
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
          <TabsTrigger 
            value="wnba" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            WNBA
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
