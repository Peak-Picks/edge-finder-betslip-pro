
import { BookOpen } from "lucide-react";

export const BettingGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-white/[0.02] shadow-xl rounded-2xl p-6 md:p-10 border border-slate-800">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome to Wiz Picks!
          </h1>
        </div>
        <p className="text-slate-300 mb-6">
          Here's a quick guide to help you get started and make the most of our AI-powered betting tools.
        </p>

        {/* Wiz Picks */}
        <SectionHeader color="emerald-400" label="Wiz Picks" />
        <SectionDescription>
          This is your main dashboard for AI-generated betting picks. Our system analyzes vast amounts of data to provide you with potential value bets across various sports.
        </SectionDescription>
        <ul className="mb-6 text-slate-300 space-y-1 pl-6 list-disc">
          <li>
            <b>Categories:</b> Picks are categorized into Top Props, Best Value, Long Shots, and Trending.
          </li>
          <li>
            <b>Filters:</b> You can filter picks by sport and league to narrow down your focus.
          </li>
          <li>
            <b>Pick Cards:</b> Each card shows the pick, odds, AI rationale, confidence level, and a game tracking bar for recent performance on similar props.
          </li>
        </ul>

        {/* Player Research (Props) */}
        <SectionHeader color="emerald-400" label="Player Research (Props)" />
        <SectionDescription>
          Dive deep into player statistics. This section allows you to research historical player performance for various propositions.
        </SectionDescription>
        <ul className="mb-6 text-slate-300 space-y-1 pl-6 list-disc">
          <li>
            <b>Sport Tabs:</b> Quickly switch between different sports/leagues like NBA, WNBA, MLB, etc.
          </li>
          <li>
            <b>Filters:</b> Use advanced filters for propositions, players, games, over/under, odds, and hit rates.
          </li>
          <li>
            <b>Player Stats Table:</b> View detailed game logs for players, including their performance for specific stats against different opponents.
          </li>
          <li>
            <b>Player Images:</b> See player photos for easier identification.
          </li>
        </ul>

        {/* AI Parlay Builder */}
        <SectionHeader color="emerald-400" label="AI Parlay Builder" />
        <SectionDescription>
          Let our AI construct a parlay for you based on your preferences, or get smart substitution suggestions for your existing parlay legs.
        </SectionDescription>
        <ul className="mb-6 text-slate-300 space-y-1 pl-6 list-disc">
          <li>
            <b>Configure:</b> Set the number of legs, sport preference, and risk level.
          </li>
          <li>
            <b>Generate:</b> AI creates a parlay with event descriptions, picks, odds, and rationale for each leg.
          </li>
          <li>
            <b>Substitute:</b> Not happy with a leg? Request AI-powered substitutions.
          </li>
          <li>
            <b>Total Odds:</b> See the combined odds for your generated parlay.
          </li>
        </ul>

        {/* Betting Info Guide */}
        <SectionHeader color="emerald-400" label="Betting Info Guide" />
        <SectionDescription>
          New to sports betting or want a refresher? This guide covers essential concepts.
        </SectionDescription>
        <ul className="text-slate-300 space-y-1 pl-6 list-disc mb-2">
          <li>
            <b>Betting Concepts:</b> Understand odds (American, Decimal, Fractional), types of bets (Moneyline, Spread, Totals, Props), and what "value" means.
          </li>
          <li>
            <b>Bankroll Management:</b> Learn crucial strategies for managing your betting funds, including unit betting and avoiding common pitfalls.
          </li>
          <li>
            <b>Responsible Gambling:</b> Important reminders and resources for betting responsibly.
          </li>
        </ul>
      </div>
    </div>
  );
};

// --- Helper Components ---
const SectionHeader = ({ color, label }: { color: string; label: string }) => (
  <div className={`flex items-center gap-2 mb-1 mt-7`}>
    {/* The BookOpen icon is used because of lucide-react constraint for this project. */}
    <BookOpen className={`w-5 h-5 text-${color}`} />
    <h2 className={`text-lg font-semibold text-${color}`}>{label}</h2>
  </div>
);

const SectionDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-400 mb-1">{children}</p>
);
