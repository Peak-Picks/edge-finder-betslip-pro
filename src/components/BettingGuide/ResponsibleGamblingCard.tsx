
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const ResponsibleGamblingCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Card className={`backdrop-blur border border-red-700/50 bg-red-900/20 ${className}`}>
    <CardHeader>
      <CardTitle className="text-xl flex items-center text-red-400">
        <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
        Responsible Gambling
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-red-200 opacity-90 leading-relaxed">
      Sports betting should be a form of entertainment, not a guaranteed way to make money. Always gamble responsibly.
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Set limits on your time and money spent betting before you start.</li>
        <li>Never bet more than you can afford to lose. Your betting bankroll should be disposable income.</li>
        <li>Understand that losing is a normal part of betting. Don't expect to win every bet.</li>
        <li>Avoid chasing losses. Stick to your bankroll management plan.</li>
        <li>Do not borrow money to gamble.</li>
        <li>Take regular breaks from betting.</li>
        <li>If you feel you might have a gambling problem, or if betting is no longer fun, seek help. Many resources are available, such as the National Council on Problem Gambling (NCPG) or local support groups. Many sportsbooks also offer self-exclusion tools and deposit limits.</li>
      </ul>
    </CardContent>
  </Card>
);

export default ResponsibleGamblingCard;
