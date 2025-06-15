
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Calculator, TrendingUp, DollarSign } from 'lucide-react';

export const BetBuilder = () => {
  const [selectedBets, setSelectedBets] = useState([
    {
      id: 1,
      type: "Player Prop",
      description: "LeBron James Over 25.5 Points",
      odds: "-110",
      edge: 5.2
    }
  ]);
  
  const [betAmount, setBetAmount] = useState("25");

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
    return (amount * 2.5).toFixed(2);
  };

  const addBet = (bet: typeof availableBets[0]) => {
    setSelectedBets([...selectedBets, bet]);
  };

  const removeBet = (betId: number) => {
    setSelectedBets(selectedBets.filter(bet => bet.id !== betId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <h1 className="text-xl font-bold text-white">Bet Builder</h1>
        <p className="text-slate-400 text-sm">Build your perfect parlay</p>
      </div>

      <div className="p-4 space-y-6">
        <Tabs defaultValue="betslip" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger 
              value="betslip" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-white"
            >
              Betslip ({selectedBets.length})
            </TabsTrigger>
            <TabsTrigger 
              value="available" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-white"
            >
              Available Bets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="betslip" className="mt-4">
            <div className="space-y-4">
              {selectedBets.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
                  <p className="text-slate-400">No bets selected</p>
                </Card>
              ) : (
                <>
                  {selectedBets.map((bet) => (
                    <Card key={bet.id} className="bg-slate-800/50 border-slate-700/50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-2">
                            {bet.type}
                          </Badge>
                          <h3 className="font-medium text-white mb-1">{bet.description}</h3>
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
                          onClick={() => removeBet(bet.id)}
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
                        // Ensure input text is white, placeholder is slate-400
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

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Calculator className="w-4 h-4 mr-2" />
                      Place Bet
                    </Button>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="available" className="mt-4">
            <div className="space-y-3">
              {availableBets.map((bet) => (
                <Card key={bet.id} className="bg-slate-800/50 border-slate-700/50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-2">
                        {bet.type}
                      </Badge>
                      <h3 className="font-medium text-white mb-1">{bet.description}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-medium">{bet.odds}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                          {bet.edge}% Edge
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addBet(bet)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
