
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { PropItem } from './PropItem';

interface PropCardProps {
  playerData: {
    player: string;
    team: string;
    matchup: string;
    props: Array<{
      type: string;
      line: number;
      odds: string;
      edge: number;
    }>;
  };
  onPlayerDetailClick: (playerData: any) => void;
  onPropClick: (playerData: any, propData: any) => void;
}

export const PropCard = ({ playerData, onPlayerDetailClick, onPropClick }: PropCardProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 p-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">{playerData.player}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPlayerDetailClick(playerData)}
              className="text-slate-400 hover:text-emerald-400 p-0.5 h-auto"
              title="Detailed Analytics"
            >
              <BarChart3 className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5">
              {playerData.team}
            </Badge>
            <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5">
              {playerData.matchup}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        {playerData.props.map((prop, propIndex) => (
          <PropItem
            key={propIndex}
            prop={prop}
            onAddToBetslip={() => {
              // Handle add to betslip logic here if needed
              console.log('Added to betslip:', prop);
            }}
            onViewInsights={() => onPropClick(playerData, prop)}
          />
        ))}
      </div>
    </Card>
  );
};
