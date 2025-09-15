import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RulesChecklist } from "./RulesChecklist";
import { TradeEntryForm } from "./TradeEntryForm";
import { TradesTable } from "./TradesTable";
import { BookOpen, TrendingUp, CheckSquare } from "lucide-react";

export interface Trade {
  id: string;
  date: string;
  marketContext: string;
  bias: "Bullish" | "Bearish" | "Neutral";
  direction: "Long" | "Short";
  pnl: number;
  riskAmount: number;
  entryReason: string;
  exitReason: string;
  rulesFollowed: boolean[];
}

const TradingJournal = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [rulesCompleted, setRulesCompleted] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    const savedTrades = localStorage.getItem("trading-journal-trades");
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
  }, []);

  const saveTrades = (newTrades: Trade[]) => {
    setTrades(newTrades);
    localStorage.setItem("trading-journal-trades", JSON.stringify(newTrades));
  };

  const addTrade = (tradeData: Omit<Trade, "id" | "date" | "rulesFollowed">) => {
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      rulesFollowed: [...rulesCompleted],
    };
    
    const updatedTrades = [newTrade, ...trades];
    saveTrades(updatedTrades);
    
    // Reset rules checklist after successful trade entry
    setRulesCompleted([false, false, false, false, false]);
  };

  const canEnterTrade = rulesCompleted.every(rule => rule);

  return (
    <div className="min-h-screen bg-trading-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            Trading Journal
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your trades, follow your rules, improve your performance
          </p>
        </div>

        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-trading-card border-trading-border">
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Rules Checklist
            </TabsTrigger>
            <TabsTrigger 
              value="entry" 
              className="flex items-center gap-2"
              disabled={!canEnterTrade}
            >
              <TrendingUp className="h-4 w-4" />
              Enter Trade
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Trade History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="space-y-6">
            <Card className="bg-trading-card border-trading-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Pre-Trade Rules Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RulesChecklist 
                  completed={rulesCompleted}
                  onChange={setRulesCompleted}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entry" className="space-y-6">
            <Card className="bg-trading-card border-trading-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Enter New Trade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TradeEntryForm onSubmit={addTrade} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-trading-card border-trading-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Trade History ({trades.length} trades)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TradesTable trades={trades} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingJournal;