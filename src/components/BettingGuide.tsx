
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, TrendingUp, Shield, Calculator, Target } from 'lucide-react';

export const BettingGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Betting Info Guide
              </h1>
              <p className="text-slate-400 text-sm">New to sports betting or want a refresher? This guide covers essential concepts.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Betting Concepts */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-emerald-400" />
              <CardTitle className="text-xl text-white">Betting Concepts</CardTitle>
            </div>
            <p className="text-slate-400">Understand odds (American, Decimal, Fractional), types of bets (Moneyline, Spread, Totals, Props), and what "value" means.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-400 mb-2">Odds Formats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">American:</span>
                    <span className="text-white">+150 (win $150 on $100) / -200 (bet $200 to win $100)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Decimal:</span>
                    <span className="text-white">2.50 (total payout including stake)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Fractional:</span>
                    <span className="text-white">3/2 (win $3 for every $2 bet)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-400 mb-2">Bet Types</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <Badge variant="secondary" className="mb-2">Moneyline</Badge>
                    <p className="text-slate-300">Bet on which team will win the game outright.</p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">Point Spread</Badge>
                    <p className="text-slate-300">Bet on the margin of victory. Favorite must win by more than the spread.</p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">Totals (Over/Under)</Badge>
                    <p className="text-slate-300">Bet on whether the combined score will be over or under a set number.</p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">Props</Badge>
                    <p className="text-slate-300">Bet on specific player or game statistics (points, yards, etc.).</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-400 mb-2">Finding Value</h4>
                <p className="text-slate-300 text-sm">Value exists when you believe the true probability of an outcome is higher than what the odds suggest. Always compare odds across multiple sportsbooks.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bankroll Management */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <CardTitle className="text-xl text-white">Bankroll Management</CardTitle>
            </div>
            <p className="text-slate-400">Learn crucial strategies for managing your betting funds, including unit betting and avoiding common pitfalls.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-blue-400">Unit Betting System</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">Define 1 unit as 1-5% of your total bankroll.</p>
                  <p className="text-slate-300">Most bets should be 1 unit, with high-confidence bets at 2-3 units maximum.</p>
                  <p className="text-slate-300">Never bet more than 5% of your bankroll on a single wager.</p>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-semibold text-emerald-400">Best Practices</h4>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>• Set a dedicated betting budget separate from living expenses</p>
                  <p>• Track all bets with detailed records</p>
                  <p>• Take breaks after losing streaks</p>
                  <p>• Never chase losses with bigger bets</p>
                  <p>• Shop for the best odds across multiple sportsbooks</p>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h4 className="font-semibold text-red-400">Common Pitfalls to Avoid</h4>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>• Betting with emotion rather than logic</p>
                  <p>• Increasing bet sizes after losses</p>
                  <p>• Betting on your favorite team without objectivity</p>
                  <p>• Ignoring bankroll limits</p>
                  <p>• Not keeping detailed records</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsible Gambling */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-purple-400" />
              <CardTitle className="text-xl text-white">Responsible Gambling</CardTitle>
            </div>
            <p className="text-slate-400">Important reminders and resources for betting responsibly.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-3">Key Principles</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• Gambling should be entertainment, not a way to make money</p>
                <p>• Never bet money you can't afford to lose</p>
                <p>• Set time and money limits before you start</p>
                <p>• Take regular breaks from betting</p>
                <p>• Seek help if gambling becomes a problem</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-3">Warning Signs</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• Betting more than you can afford</p>
                <p>• Chasing losses with bigger bets</p>
                <p>• Lying about betting activities</p>
                <p>• Neglecting responsibilities to gamble</p>
                <p>• Feeling anxious when not betting</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-3">Resources for Help</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• National Problem Gambling Helpline: 1-800-522-4700</p>
                <p>• Gamblers Anonymous: www.gamblersanonymous.org</p>
                <p>• National Council on Problem Gambling: www.ncpgambling.org</p>
                <p>• Most sportsbooks offer self-exclusion tools</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border-emerald-500/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-white">Quick Success Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Research thoroughly before placing any bet</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Focus on sports and leagues you know well</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Keep detailed records of all your bets</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Be patient and disciplined with your strategy</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Never bet under the influence of alcohol or emotions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
