import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, BarChart2, Wand2, BookOpen, CheckCircle } from 'lucide-react';
import WizPicksLogo from './WizPicksLogo';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const handleDismiss = () => {
    localStorage.setItem('wizPicksTutorialSeen', 'true');
    localStorage.setItem('wizPicksTutorialLastSeen', Date.now().toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <WizPicksLogo className="h-10 w-10 mr-2 drop-shadow-lg" />
          </div>
          <DialogTitle className="text-2xl flex items-center justify-center">
            Welcome to Wiz Picks!
          </DialogTitle>
          <DialogDescription className="text-center mt-1">
            Here's a quick guide to help you get started and make the most of our AI-powered betting tools.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] p-1 pr-4">
          <div className="space-y-6 py-4 text-sm">
            <section>
              <h3 className="font-semibold text-lg mb-2 flex items-center text-primary">
                <TrendingUp className="h-5 w-5 mr-2" /> Wiz Picks
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                This is your main dashboard for AI-generated betting picks. Our system analyzes vast amounts of data to provide you with potential value bets across various sports.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 pl-2 text-muted-foreground">
                <li><strong>Categories:</strong> Picks are categorized into Top Props, Best Value, Long Shots, and Trending.</li>
                <li><strong>Filters:</strong> You can filter picks by sport and league to narrow down your focus.</li>
                <li><strong>Pick Cards:</strong> Each card shows the pick, odds, AI rationale, confidence level, and a game tracking bar for recent performance on similar props.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 flex items-center text-primary">
                <BarChart2 className="h-5 w-5 mr-2" /> Player Research (Props)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Dive deep into player statistics. This section allows you to research historical player performance for various propositions.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 pl-2 text-muted-foreground">
                <li><strong>Sport Tabs:</strong> Quickly switch between different sports/leagues like NBA, WNBA, MLB, etc.</li>
                <li><strong>Filters:</strong> Use advanced filters for propositions, players, games, over/under, odds, and hit rates.</li>
                <li><strong>Player Stats Table:</strong> View detailed game logs for players, including their performance for specific stats against different opponents.</li>
                <li><strong>Player Images:</strong> See player photos for easier identification.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 flex items-center text-primary">
                <Wand2 className="h-5 w-5 mr-2" /> AI Parlay Builder
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Let our AI construct a parlay for you based on your preferences, or get smart substitution suggestions for your existing parlay legs.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 pl-2 text-muted-foreground">
                <li><strong>Configure:</strong> Set the number of legs, sport preference, and risk level.</li>
                <li><strong>Generate:</strong> AI creates a parlay with event descriptions, picks, odds, and rationale for each leg.</li>
                <li><strong>Substitute:</strong> Not happy with a leg? Request AI-powered substitutions.</li>
                <li><strong>Total Odds:</strong> See the combined odds for your generated parlay.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 flex items-center text-primary">
                <BookOpen className="h-5 w-5 mr-2" /> Betting Info Guide
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                New to sports betting or want a refresher? This guide covers essential concepts.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 pl-2 text-muted-foreground">
                <li><strong>Betting Concepts:</strong> Understand odds (American, Decimal, Fractional), types of bets (Moneyline, Spread, Totals, Props), and what "value" means.</li>
                <li><strong>Bankroll Management:</strong> Learn crucial strategies for managing your betting funds, including unit betting and avoiding common pitfalls.</li>
                <li><strong>Responsible Gambling:</strong> Important reminders and resources for betting responsibly.</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-2">
          <Button onClick={handleDismiss} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <CheckCircle className="h-5 w-5 mr-2" /> Got It, Let's Go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialModal;
