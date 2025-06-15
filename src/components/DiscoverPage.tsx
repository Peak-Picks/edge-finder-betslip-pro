
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Star, Zap, Crown, Trophy } from 'lucide-react';

export const DiscoverPage = () => {
  const expertPicks = [
    {
      expert: "Sharp Edge Analytics",
      pick: "Chiefs -3.5 vs Bills",
      confidence: 92,
      record: "67-23",
      reasoning: "Chiefs have covered 8 of last 10 as road favorites"
    },
    {
      expert: "Pro Prop Hunter",
      pick: "Mahomes Over 275.5 Passing Yards",
      confidence: 85,
      record: "124-76",
      reasoning: "Bills defense allows 6th most passing yards per game"
    }
  ];

  const trendingBets = [
    { bet: "Lakers ML", percentage: 78, volume: "High" },
    { bet: "Over 225.5 Total", percentage: 65, volume: "Medium" },
    { bet: "LeBron Over 25.5 Points", percentage: 89, volume: "Very High" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <h1 className="text-xl font-bold">Discover</h1>
        <p className="text-slate-400 text-sm">Find the best betting opportunities</p>
      </div>

      <div className="p-4 space-y-6">
        <Tabs defaultValue="experts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger 
              value="experts" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              <Crown className="w-4 h-4 mr-1" />
              Experts
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger 
              value="community" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              <Users className="w-4 h-4 mr-1" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experts" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold">Expert Picks</h2>
              </div>
              
              {expertPicks.map((pick, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700/50 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{pick.expert}</h3>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          {pick.confidence}% Confidence
                        </Badge>
                      </div>
                      <p className="text-emerald-400 font-medium mb-1">{pick.pick}</p>
                      <p className="text-sm text-slate-400">Record: {pick.record}</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
                    <p className="text-sm text-slate-300">{pick.reasoning}</p>
                  </div>
                  
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Follow This Pick
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Trending Bets</h2>
              
              {trendingBets.map((bet, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">{bet.bet}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">{bet.percentage}%</div>
                      <Badge 
                        className={
                          bet.volume === 'Very High' ? 'bg-red-500/20 text-red-400' :
                          bet.volume === 'High' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }
                      >
                        {bet.volume} Volume
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 bg-slate-700/30 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                        style={{ width: `${bet.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{bet.percentage}% backing</span>
                  </div>
                  
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Zap className="w-4 h-4 mr-1" />
                    Quick Add
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="mt-4">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Community Features</h3>
              <p className="text-slate-400 mb-4">Connect with other bettors and share insights</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Coming Soon
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
