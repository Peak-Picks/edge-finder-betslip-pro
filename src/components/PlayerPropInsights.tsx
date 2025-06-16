
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Brain, BarChart3, Target, Clock } from 'lucide-react';

interface PlayerPropInsightsProps {
  prop: {
    player: string;
    team: string;
    prop: string;
    line: number;
    type: string;
    odds: string;
    edge: number;
    projected: number;
    confidence: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlayerPropInsights = ({ prop, open, onOpenChange }: PlayerPropInsightsProps) => {
  if (!prop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-400">
            {prop.player} - {prop.prop} Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Prop Info */}
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-emerald-400">Prop Details</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Player:</span>
                <span className="text-white font-medium">{prop.player}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Team:</span>
                <span className="text-white font-medium">{prop.team}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Prop Type:</span>
                <span className="text-white font-medium">{prop.prop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Line:</span>
                <span className="text-white font-medium">{prop.line}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Bet Type:</span>
                <span className="text-white font-medium">{prop.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Odds:</span>
                <span className="text-white font-medium">{prop.odds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Edge:</span>
                <span className="text-emerald-400 font-medium">{prop.edge.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Projection:</span>
                <span className="text-emerald-400 font-medium">{prop.projected}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Confidence:</span>
                <Badge className={
                  prop.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  prop.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border-red-500/30'
                }>
                  {prop.confidence.toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Note about data integration */}
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-blue-400">Analysis Status</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Detailed analysis including recent performance, matchup data, and AI insights will be available once real data sources are integrated.
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
