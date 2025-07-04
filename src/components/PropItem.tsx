
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';

interface PropItemProps {
  prop: {
    type: string;
    line: number;
    odds: string;
    edge: number;
  };
  onAddToBetslip: () => void;
  onViewInsights: () => void;
  alreadyAdded?: boolean;
}

export const PropItem = ({ prop, onAddToBetslip, onViewInsights, alreadyAdded }: PropItemProps) => {
  const getEdgeColor = (edge: number) => {
    if (edge >= 10) return 'text-emerald-400';
    if (edge >= 5) return 'text-yellow-400';
    return 'text-slate-400';
  };

  return (
    <div 
      className="bg-slate-700/30 rounded-lg p-2 cursor-pointer hover:bg-slate-700/40 transition-colors"
      onClick={onViewInsights}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-white text-sm">{prop.type}</h4>
          <p className="text-xs text-slate-400">O/U {prop.line}</p>
        </div>
        <div className="text-right">
          <div className={`text-xs font-bold ${getEdgeColor(prop.edge)}`}>
            {prop.edge}%
          </div>
          <div className="text-xs font-bold text-white mt-0.5">{prop.odds}</div>
        </div>
      </div>

      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
        <Button 
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-7 text-xs"
          size="sm"
          onClick={onAddToBetslip}
          disabled={alreadyAdded}
        >
          <Plus className="w-3 h-3 mr-1" />
          {alreadyAdded ? "Added" : "Add"}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 h-7 px-2"
          onClick={(e) => {
            e.stopPropagation();
            onViewInsights();
          }}
        >
          <TrendingUp className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
