
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Trophy, TrendingUp, DollarSign, Target, Bell, HelpCircle, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const userStats = {
    totalBets: 147,
    winRate: 62.3,
    roi: 12.3,
    totalProfit: 1247.50,
    currentStreak: 5,
    bestStreak: 12
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <h1 className="text-xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 text-sm">Your betting performance and settings</p>
      </div>

      <div className="p-4 space-y-6">
        {/* User Profile */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">John Bettor</h2>
              <p className="text-slate-400">Pro Bettor • Member since Jan 2024</p>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mt-1">
                Premium Member
              </Badge>
            </div>
          </div>
        </Card>

        {/* Performance Stats */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Performance</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{userStats.winRate}%</div>
              <div className="text-sm text-slate-400">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">+{userStats.roi}%</div>
              <div className="text-sm text-slate-400">ROI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">${userStats.totalProfit}</div>
              <div className="text-sm text-slate-400">Total Profit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{userStats.totalBets}</div>
              <div className="text-sm text-slate-400">Total Bets</div>
            </div>
          </div>

          <Separator className="my-4 bg-slate-700" />

          <div className="flex justify-between text-sm">
            <div>
              <span className="text-slate-400">Current Streak: </span>
              <span className="text-emerald-400 font-medium">{userStats.currentStreak}W</span>
            </div>
            <div>
              <span className="text-slate-400">Best Streak: </span>
              <span className="text-emerald-400 font-medium">{userStats.bestStreak}W</span>
            </div>
          </div>
        </Card>

        {/* Settings Menu */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
          
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700/50">
              <Settings className="w-4 h-4 mr-3" />
              Account Settings
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700/50">
              <Bell className="w-4 h-4 mr-3" />
              Notifications
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700/50">
              <DollarSign className="w-4 h-4 mr-3" />
              Payment Methods
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700/50">
              <Target className="w-4 h-4 mr-3" />
              Betting Limits
            </Button>
            
            <Separator className="my-2 bg-slate-700" />
            
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700/50">
              <HelpCircle className="w-4 h-4 mr-3" />
              Help & Support
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Achievement Section */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Recent Achievements</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">Hot Streak</h4>
                <p className="text-sm text-slate-400">Won 5 bets in a row</p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400">New</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">Sharp Bettor</h4>
                <p className="text-sm text-slate-400">Achieved 60%+ win rate</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
