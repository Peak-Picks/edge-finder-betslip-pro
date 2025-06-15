import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Calculator, TrendingUp, DollarSign, CheckCircle, XCircle, Ban, Target, Clock, Edit, Trash } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';
import { BetResultModal } from './BetResultModal';
import { EditBetSlipModal } from './EditBetSlipModal';
import { DeleteBetSlipDialog } from './DeleteBetSlipDialog';

export const BetBuilder = () => {
  const {
    betSlip,
    addToBetSlip,
    removeFromBetSlip,
    clearBetSlip,
    savedBetSlips,
    addSavedBetSlip,
    markBetSlipResult,
    editSavedBetSlip,
    deleteSavedBetSlip,
  } = useBetSlipContext();

  const [betAmount, setBetAmount] = useState("25");
  const [tab, setTab] = useState("betslip");
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<{ slip: any; index: number } | null>(null);

  // Simulate available bets for possible future use or quick add
  const availableBets = [
    {
      id: "2",
      type: "Spread",
      description: "Lakers -3.5",
      odds: "-115",
      edge: 3.8
    },
    {
      id: "3",
      type: "Total",
      description: "Over 225.5 Points",
      odds: "-110",
      edge: 2.1
    }
  ];

  // Convert American odds to decimal odds
  const oddsToDecimal = (americanOdds: string) => {
    const odds = parseInt(americanOdds);
    if (odds > 0) {
      return (odds / 100) + 1;
    } else {
      return (100 / Math.abs(odds)) + 1;
    }
  };

  // Calculate combined odds and payout
  const calculatePayout = () => {
    const amount = parseFloat(betAmount) || 0;
    if (betSlip.length === 0) return amount.toFixed(2);
    
    // Calculate combined decimal odds for parlay
    const combinedDecimalOdds = betSlip.reduce((acc, bet) => {
      return acc * oddsToDecimal(bet.odds);
    }, 1);
    
    const payout = amount * combinedDecimalOdds;
    return payout.toFixed(2);
  };

  // Calculate combined American odds for display
  const getCombinedOdds = () => {
    if (betSlip.length === 0) return "+100";
    
    const combinedDecimalOdds = betSlip.reduce((acc, bet) => {
      return acc * oddsToDecimal(bet.odds);
    }, 1);
    
    // Convert back to American odds
    if (combinedDecimalOdds >= 2) {
      return `+${Math.round((combinedDecimalOdds - 1) * 100)}`;
    } else {
      return `-${Math.round(100 / (combinedDecimalOdds - 1))}`;
    }
  };

  const handleSaveSlip = () => {
    if (betSlip.length === 0) return;
    addSavedBetSlip(betSlip, betAmount);
    clearBetSlip();
    setBetAmount("25");
    setTab("saved");
  };

  const handleMarkResult = (slip: any, index: number) => {
    setSelectedSlip({ slip, index });
    setResultModalOpen(true);
  };

  const handleEditSlip = (slip: any, index: number) => {
    setSelectedSlip({ slip, index });
    setEditModalOpen(true);
  };

  const handleDeleteSlip = (slip: any, index: number) => {
    setSelectedSlip({ slip, index });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSlip) {
      deleteSavedBetSlip(selectedSlip.index);
    }
    setSelectedSlip(null);
    setDeleteDialogOpen(false);
  };

  const handleEditSave = (amount: string, notes?: string) => {
    if (selectedSlip) {
      editSavedBetSlip(selectedSlip.index, amount, notes);
    }
    setSelectedSlip(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'won':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle className="w-3 h-3 mr-1" />Won</Badge>;
      case 'lost':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Lost</Badge>;
      case 'void':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Ban className="w-3 h-3 mr-1" />Void</Badge>;
      case 'partial':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30"><Target className="w-3 h-3 mr-1" />Partial</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const calculateStats = () => {
    const settled = savedBetSlips.filter(slip => slip.status !== 'pending');
    const won = settled.filter(slip => slip.status === 'won');
    const totalWagered = savedBetSlips.reduce((sum, slip) => sum + parseFloat(slip.amount), 0);
    const totalReturns = settled.reduce((sum, slip) => sum + (slip.actualPayout || 0), 0);
    const profit = totalReturns - settled.reduce((sum, slip) => sum + parseFloat(slip.amount), 0);
    
    return {
      totalBets: savedBetSlips.length,
      settledBets: settled.length,
      winRate: settled.length > 0 ? ((won.length / settled.length) * 100).toFixed(1) : '0.0',
      totalWagered: totalWagered.toFixed(2),
      profit: profit.toFixed(2),
      profitColor: profit >= 0 ? 'text-emerald-400' : 'text-red-400'
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      {/* 
        Ensure no extra/overriding classes or misplaced bg-white are present.
      */}
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
                        <span className="text-white">{getCombinedOdds()}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveSlip}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Save Slip
                    </Button>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <div className="space-y-4">
              {/* Stats Summary */}
              {savedBetSlips.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                  <h3 className="font-semibold mb-3 text-white">Betting Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Total Bets:</p>
                      <p className="text-white font-medium">{stats.totalBets}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Win Rate:</p>
                      <p className="text-white font-medium">{stats.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Total Wagered:</p>
                      <p className="text-white font-medium">${stats.totalWagered}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Profit/Loss:</p>
                      <p className={`font-medium ${stats.profitColor}`}>${stats.profit}</p>
                    </div>
                  </div>
                </Card>
              )}

              {savedBetSlips.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
                  <p className="text-slate-400">No saved bet slips</p>
                </Card>
              ) : (
                savedBetSlips
                  .slice()
                  .reverse()
                  .map((slip, i) => {
                    const originalIndex = savedBetSlips.length - 1 - i;
                    return (
                      <Card key={slip.timestamp} className="bg-slate-800/50 border-slate-700/50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">#{savedBetSlips.length - i} • {new Date(slip.timestamp).toLocaleString()}</span>
                            {getStatusBadge(slip.status)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-slate-700/80 text-slate-300 border-slate-800 text-xs">{slip.bets.length} bet{slip.bets.length === 1 ? '' : 's'}</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSlip(slip, originalIndex)}
                              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 p-1 h-8 w-8"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSlip(slip, originalIndex)}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10 p-1 h-8 w-8"
                            >
                              <Trash className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          {slip.bets.map(bet => (
                            <div key={bet.id} className="border-b border-slate-700/70 py-1 flex justify-between items-center">
                              <span className="text-slate-100 text-sm">
                                {bet.description || bet.subtitle}
                              </span>
                              <span className="text-emerald-400 font-medium">{bet.odds}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-700 mb-3">
                          <div>
                            <span className="text-slate-400 text-xs">Wager:</span>{" "}
                            <span className="text-white font-semibold text-sm">${slip.amount}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-xs">
                              {slip.status === 'won' ? 'Payout:' : 'Potential:'}
                            </span>{" "}
                            <span className="text-emerald-400 font-semibold text-sm">
                              ${slip.actualPayout?.toFixed(2) || (parseFloat(slip.amount) * 2.5).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {slip.notes && (
                          <div className="mb-3 p-2 bg-slate-700/30 rounded text-sm">
                            <span className="text-slate-400">Notes: </span>
                            <span className="text-slate-200">{slip.notes}</span>
                          </div>
                        )}

                        {slip.status === 'pending' && (
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleMarkResult(slip, originalIndex)}
                          >
                            <Target className="w-4 h-4 mr-1" />
                            Mark Result
                          </Button>
                        )}
                      </Card>
                    );
                  })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BetResultModal
        slip={selectedSlip?.slip}
        slipIndex={selectedSlip?.index || 0}
        open={resultModalOpen}
        onOpenChange={setResultModalOpen}
        onMarkResult={markBetSlipResult}
      />

      <EditBetSlipModal
        slip={selectedSlip?.slip}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleEditSave}
      />

      <DeleteBetSlipDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        slipNumber={(selectedSlip?.index || 0) + 1}
      />
    </div>
  );
};
