
import React from "react";
import { BookOpen } from "lucide-react";

const BettingGuideHeader: React.FC = () => (
  <header className="mb-8 text-center">
    <BookOpen className="h-16 w-16 mx-auto text-primary mb-4" />
    <h1 className="text-4xl font-bold text-foreground">Betting Info &amp; Bankroll Guide</h1>
    <p className="text-lg text-muted-foreground mt-2">
      Your comprehensive guide to understanding sports betting and managing your funds wisely.
    </p>
  </header>
);

export default BettingGuideHeader;
