
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';

export const BetBuilder = () => {
  const {
    betSlip,
    addToBetSlip,
    removeFromBetSlip,
    clearBetSlip,
    savedBetSlips,
    addSavedBetSlip,
  } = useBetSlipContext();

  const [betAmount, setBetAmount] = useState("25");
  const [tab, setTab] = useState("betslip");

  // Simulate available bets for possible future use or quick add
  const availableBets = [
    {
      id: 2,
      type: "Spread",
      description: "Lakers -3.5",
      odds: "-115",
      edge: 3.8
    },
    {
      id: 3,
      type: "Total",
      description: "Over 225.5 Points",
      odds: "-110",
      edge: 2.1
    }
  ];

  const calculatePayout = () => {
    const amount = parseFloat(betAmount) || 0;
    // Dummy payout formula (should eventually calculate actual odds from bets)
    return (amount * 2.5).toFixed(2);
  };

  const handlePlaceBet = () => {
    if (betSlip.length === 0) return;
    addSavedBetSlip(betSlip, betAmount);
    clearBetSlip();
    setBetAmount("25");
    setTab("saved");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <h1 className="text-xl font-bold text-white">Bet Builder</h1>
        <p className="text-slate-400 text-sm">Build your perfect parlay</p>
      </div>

      <div className="p-4 space-y-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger 
              value="betslip" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-white"
            >
              Betslip ({betSlip.length})
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-white"
            >
              Saved Bet Slips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="betslip" className="mt-4">
            <div className="space-y-4">
              {betSlip.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
                  <p className="text-slate-400">No bets selected</p>
                </Card>
              ) : (
                <>
                  {betSlip.map((bet) => (
                    <Card key={bet.id} className="bg-slate-800/50 border-slate-700/50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-2">
                            {bet.type}
                          </Badge>
                          <h3 className="font-medium text-white mb-1">
                            {bet.description || bet.subtitle}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-medium">{bet.odds}</span>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                              {bet.edge}% Edge
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromBetSlip(bet.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}

                  <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                    <h3 className="font-semibold mb-3 text-white">Bet Amount</h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder:text-slate-400"
                        placeholder="Enter amount"
                      />
                      <Button variant="outline" className="border-slate-600 text-slate-300">
                        <DollarSign className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Potential Payout:</span>
                        <span className="text-emerald-400 font-medium">${calculatePayout()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Combined Odds:</span>
                        <span className="text-white">+250</span>
                      </div>
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handlePlaceBet}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Place Bet
                    </Button>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <div className="space-y-4">
              {savedBetSlips.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
                  <p className="text-slate-400">No saved bet slips</p>
                </Card>
              ) : (
                savedBetSlips
                  .slice()
                  .reverse()
                  .map((slip, i) => (
                  <Card key={slip.timestamp} className="bg-slate-800/50 border-slate-700/50 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 text-xs">#{savedBetSlips.length - i} • {new Date(slip.timestamp).toLocaleString()}</span>
                      <Badge className="bg-slate-700/80 text-slate-300 border-slate-800 text-xs">{slip.bets.length} bet{slip.bets.length === 1 ? '' : 's'}</Badge>
                    </div>
                    <div className="space-y-1 mb-2">
                      {slip.bets.map(bet => (
                        <div key={bet.id} className="border-b border-slate-700/70 py-1 flex justify-between items-center">
                          <span className="text-slate-100 text-sm">
                            {bet.description || bet.subtitle}
                          </span>
                          <span className="text-emerald-400 font-medium">{bet.odds}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700 mt-2">
                      <div>
                        <span className="text-slate-400 text-xs">Wager:</span>{" "}
                        <span className="text-white font-semibold text-sm">${slip.amount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Potential:</span>{" "}
                        <span className="text-emerald-400 font-semibold text-sm">${(parseFloat(slip.amount) * 2.5).toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
