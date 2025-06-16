// Updated BestBets.tsx with manual refresh and stored data
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, Star, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';
import { dynamicPicksGenerator, GeneratedPick } from '../services/dynamicPicksGenerator';
import { apiManager } from '../services/apiManager';
import { LeagueTabsHeader } from './LeagueTabsHeader';

export const BestBets = () => {
  const { addToBetSlip, betSlip } = useBetSlipContext();
  const [bestBets, setBestBets] = useState<GeneratedPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('nba');
  const [refreshStatus, setRefreshStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | null;
  }>({ message: '', type: null });

  useEffect(() => {
    loadBestBets();
  }, []);

  const loadBestBets = () => {
    setLoading(true);
    try {
      const picks = dynamicPicksGenerator.generateBestBets();
      setBestBets(picks);
      
      // Show data status
      const status = apiManager.