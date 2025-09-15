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
    <div className="min-h-screen bg-trading-bg p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Market-Style Design */}
        <div className="relative">
          <div className="absolute inset-0 trading-glow rounded-2xl"></div>
          <div className="relative glass-effect p-8 rounded-2xl border-2 border-primary/20">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 trading-glow">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  TRADING JOURNAL
                </h1>
              </div>
              <p className="text-muted-foreground text-xl font-medium">
                Professional Trading Performance Tracker
              </p>
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{trades.length}</div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-profit">
                    {trades.filter(t => t.pnl > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Winning Trades</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-loss">
                    {trades.filter(t => t.pnl < 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Losing Trades</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Trading Tabs */}
        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-card/50 backdrop-blur-sm border border-primary/20 p-1 trading-shadow">
            <TabsTrigger 
              value="checklist" 
              className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <CheckSquare className="h-5 w-5" />
              PRE-TRADE RULES
            </TabsTrigger>
            <TabsTrigger 
              value="entry" 
              className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all duration-300"
              disabled={!canEnterTrade}
            >
              <TrendingUp className="h-5 w-5" />
              ENTER TRADE
              {!canEnterTrade && <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">LOCKED</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-success data-[state=active]:text-success-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <BookOpen className="h-5 w-5" />
              TRADE HISTORY
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="space-y-8 mt-8">
            <div className="relative">
              <div className="absolute inset-0 trading-shadow rounded-xl"></div>
              <Card className="relative glass-effect border-primary/30 trading-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CheckSquare className="h-6 w-6 text-primary" />
                    </div>
                    PRE-TRADE RULES CHECKLIST
                    <div className="ml-auto text-lg">
                      <span className="text-primary font-bold">{rulesCompleted.filter(Boolean).length}</span>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RulesChecklist 
                    completed={rulesCompleted}
                    onChange={setRulesCompleted}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="entry" className="space-y-8 mt-8">
            <div className="relative">
              <div className="absolute inset-0 trading-shadow rounded-xl"></div>
              <Card className="relative glass-effect border-accent/30 trading-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                    ENTER NEW TRADE
                    <div className="ml-auto">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                        READY TO TRADE
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TradeEntryForm onSubmit={addTrade} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-8 mt-8">
            <div className="relative">
              <div className="absolute inset-0 trading-shadow rounded-xl"></div>
              <Card className="relative glass-effect border-success/30 trading-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-success/10">
                      <BookOpen className="h-6 w-6 text-success" />
                    </div>
                    TRADE HISTORY
                    <div className="ml-auto text-lg">
                      <span className="text-success font-bold">{trades.length}</span>
                      <span className="text-muted-foreground"> TRADES</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TradesTable trades={trades} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingJournal;