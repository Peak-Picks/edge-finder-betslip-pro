
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DollarSign, Search } from "lucide-react";

const BankrollAccordion: React.FC = () => (
  <Card className="bg-card">
    <CardHeader>
      <CardTitle className="text-2xl flex items-center">
        <DollarSign className="h-6 w-6 mr-2 text-primary" />
        Bankroll Management
      </CardTitle>
      <CardDescription>Crucial strategies for managing your betting funds effectively.</CardDescription>
    </CardHeader>
    <CardContent>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="bm-1">
          <AccordionTrigger className="text-lg hover:no-underline">
            What is a Bankroll?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
            Your bankroll is the total amount of money you have specifically set aside for betting. This money should be separate from your essential living expenses. Never bet with money you cannot afford to lose.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="bm-2">
          <AccordionTrigger className="text-lg hover:no-underline">
            Unit Betting (Staking Plan)
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
            A unit is a percentage of your bankroll, typically 1-5%. For example, if your bankroll is $1000 and your unit size is 1%, each unit is $10.
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Flat Betting:</strong> Bet the same unit size on every wager, regardless of confidence. Simple and helps manage variance.</li>
              <li><strong>Percentage Staking:</strong> Your unit size is always a fixed percentage of your current bankroll. If your bankroll grows, your unit size grows; if it shrinks, your unit size shrinks.</li>
              <li><strong>Confidence-Based Staking:</strong> Adjust your unit size based on your confidence in a bet (e.g., 1 unit for low confidence, 3 units for high confidence). Requires discipline and honest self-assessment. Wiz Picks provides a confidence level that can inform this.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="bm-3">
          <AccordionTrigger className="text-lg hover:no-underline">
            Tracking Your Bets
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
            Keep a detailed record of all your bets: date, sport, selection, odds, stake, profit/loss, and sportsbook. This helps you:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Analyze your performance.</li>
              <li>Identify your strengths and weaknesses.</li>
              <li>Track your bankroll growth/decline.</li>
              <li>Make informed decisions about future bets.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="bm-4">
          <AccordionTrigger className="text-lg hover:no-underline flex items-center">
            <Search className="h-5 w-5 mr-2 text-primary/80" /> Shopping for the Best Lines
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
            Different sportsbooks may offer slightly different odds or lines for the same event. "Line shopping" means checking multiple sportsbooks to find the best possible odds for your bet.
            <br /><br />
            Even small differences can significantly impact your long-term profitability. For example, getting -105 instead of -110 consistently, or +7.5 points instead of +7, adds up. It's advisable to have accounts at a few reputable sportsbooks to take advantage of the best available lines.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="bm-5">
          <AccordionTrigger className="text-lg hover:no-underline">
            Avoiding Common Pitfalls
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Chasing Losses:</strong> Trying to win back lost money by increasing stakes or making impulsive bets. This is a quick way to deplete your bankroll.</li>
              <li><strong>Betting Under the Influence:</strong> Avoid betting when your judgment is impaired by alcohol or drugs.</li>
              <li><strong>Emotional Betting:</strong> Betting on your favorite team regardless of odds or value, or betting out of frustration after a loss.</li>
              <li><strong>Ignoring Bankroll Rules:</strong> Deviating from your staking plan, especially after a big win or loss. Discipline is key.</li>
              <li><strong>Betting on Too Many Games:</strong> Spreading your bankroll too thin can make it harder to see significant returns and can lead to less researched bets. Focus on quality over quantity.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
);

export default BankrollAccordion;
