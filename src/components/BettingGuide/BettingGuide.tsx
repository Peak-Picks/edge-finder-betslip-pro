
import React from "react";
import BettingGuideHeader from "./BettingGuideHeader";
import ConceptsAccordion from "./ConceptsAccordion";
import BankrollAccordion from "./BankrollAccordion";
import ResponsibleGamblingCard from "./ResponsibleGamblingCard";

const BettingGuide: React.FC = () => (
  <div className="container mx-auto px-0 py-8 md:px-6 lg:px-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
    <BettingGuideHeader />
    <div className="grid md:grid-cols-3 gap-6">
      <ConceptsAccordion cardClass="bg-slate-800/90 border border-slate-700/60 text-white" />
      <BankrollAccordion cardClass="bg-slate-800/90 border border-slate-700/60 text-white" />
    </div>
    <ResponsibleGamblingCard className="mt-8 bg-destructive/10 border-destructive/30 text-destructive-foreground backdrop-blur" />
  </div>
);

export default BettingGuide;
