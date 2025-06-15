
import React from "react";
import BettingGuideHeader from "./BettingGuideHeader";
import ConceptsAccordion from "./ConceptsAccordion";
import BankrollAccordion from "./BankrollAccordion";
import ResponsibleGamblingCard from "./ResponsibleGamblingCard";

const BettingGuide: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <BettingGuideHeader />
    <div className="grid md:grid-cols-3 gap-6">
      <ConceptsAccordion />
      <BankrollAccordion />
    </div>
    <ResponsibleGamblingCard />
  </div>
);

export default BettingGuide;
