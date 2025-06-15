
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ConceptsAccordion: React.FC<{ cardClass?: string }> = ({ cardClass = "" }) => (
  <Card className={`md:col-span-2 ${cardClass}`}>
    <CardHeader>
      <CardTitle className="text-2xl text-foreground">
        Understanding Betting Concepts
      </CardTitle>
      <CardDescription className="text-foreground">
        Key terms and ideas to get you started in sports betting.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg hover:no-underline">
            What are Odds?
          </AccordionTrigger>
          <AccordionContent className="text-base text-white leading-relaxed">
            Odds represent the probability of an event occurring and determine how much you can win.
            There are three main types:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>American Odds:</strong> Displayed with a plus (+) or minus (-) sign. Negative odds (e.g., -150) show how much you need to bet to win $100. Positive odds (e.g., +200) show how much you win for every $100 bet.</li>
              <li><strong>Decimal Odds:</strong> Common in Europe, Australia, and Canada. Represents the total payout (stake + profit). E.g., odds of 2.50 mean a $10 bet returns $25 ($15 profit).</li>
              <li><strong>Fractional Odds:</strong> Common in the UK and Ireland. Displayed as a fraction (e.g., 5/1). A 5/1 odds means you win $5 for every $1 you bet, plus your stake back.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg hover:no-underline">Types of Bets</AccordionTrigger>
          <AccordionContent className="text-base text-white leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Moneyline:</strong> A bet on which team or player will win outright.</li>
              <li><strong>Point Spread (Handicap):</strong> Betting on the margin of victory. The favorite "gives" points (-7.5), and the underdog "gets" points (+7.5).</li>
              <li><strong>Totals (Over/Under):</strong> Betting on whether the total combined score of a game will be over or under a specific number set by the sportsbook.</li>
              <li><strong>Proposition Bets (Props):</strong> Bets on specific occurrences within a game that don't necessarily affect the final outcome (e.g., player points, assists, touchdowns). Our "Wiz Picks" often focus on these.</li>
              <li><strong>Parlays:</strong> Combining multiple bets into one. All selections must win for the parlay to pay out, but offers higher potential returns.</li>
              <li><strong>Futures:</strong> Bets on outcomes that will be decided in the future (e.g., championship winner, MVP).</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg hover:no-underline">What is "Value" in Betting?</AccordionTrigger>
          <AccordionContent className="text-base text-white leading-relaxed">
            Value betting means finding odds that are higher than the true probability of an outcome. If you believe a team has a 60% chance to win, but the odds imply a 50% chance (e.g., +100 American odds), that's a value bet.
            <br /><br />
            Identifying value requires research, understanding statistics, and sometimes going against popular opinion. It's about finding discrepancies between the sportsbook's implied probability and your own assessed probability. Wiz Picks aims to help identify potential value based on AI analysis.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg hover:no-underline">
            Understanding Implied Probability
          </AccordionTrigger>
          <AccordionContent className="text-base text-white leading-relaxed">
            Implied probability is the likelihood of an outcome as suggested by the betting odds. You can calculate it from any odds format:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>American Odds (Negative):</strong> Implied Probability = Odds / (Odds + 100) * 100. For -110, it's 110 / (110 + 100) * 100 = 52.38%.</li>
              <li><strong>American Odds (Positive):</strong> Implied Probability = 100 / (Odds + 100) * 100. For +150, it's 100 / (150 + 100) * 100 = 40%.</li>
              <li><strong>Decimal Odds:</strong> Implied Probability = (1 / Decimal Odds) * 100. For 2.00, it's (1 / 2.00) * 100 = 50%.</li>
            </ul>
            <br />
            Sportsbooks add a margin (also known as "vig" or "juice") to the odds. This is why if you sum the implied probabilities for all possible outcomes of an event (e.g., Team A wins, Team B wins, Draw), the total will be over 100%. This margin is how sportsbooks make money.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-lg hover:no-underline">
            The Vig (Juice / Margin)
          </AccordionTrigger>
          <AccordionContent className="text-base text-white leading-relaxed">
            The "vig" or "juice" is the commission a sportsbook charges for taking a bet. It's built into the odds. For example, on a point spread bet where both sides are considered equally likely, you'll often see odds of -110 for each side instead of +100. This means you have to risk $110 to win $100. That extra $10 (relative to a "fair" +100 bet) is part of the sportsbook's margin.
            <br /><br />
            Understanding the vig is crucial because it means you need to win more than 50% of your bets (for even money propositions) just to break even. For -110 odds, your break-even point is 52.38%.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-lg hover:no-underline">
            Line Movement
          </AccordionTrigger>
          <AccordionContent className="text-base text-white leading-relaxed">
            Betting lines and odds are not static; they can change leading up to an event. This is called "line movement." Reasons for line movement include:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Betting Volume:</strong> If a lot of money is bet on one side, sportsbooks may adjust the line to encourage betting on the other side to balance their risk.</li>
              <li><strong>News & Information:</strong> Key injuries, player absences, weather changes, or other significant news can impact the perceived probabilities and cause lines to move.</li>
              <li><strong>Sharp Bettors:</strong> Sportsbooks respect the opinions of professional or "sharp" bettors. If sharps are heavily betting one side, the line might move in that direction.</li>
            </ul>
            Tracking line movement can sometimes offer insights, but it's also important to understand why the line is moving. "Closing Line Value" (CLV) refers to how much better the odds you got are compared to the odds when the market closes (just before the event starts). Consistently getting good CLV is often a sign of a skilled bettor.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
);

export default ConceptsAccordion;
