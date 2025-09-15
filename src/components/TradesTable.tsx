import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, ArrowRight } from "lucide-react";
import type { Trade } from "./TradingJournal";

interface TradesTableProps {
  trades: Trade[];
}

export const TradesTable = ({ trades }: TradesTableProps) => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  if (trades.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-muted-foreground">
          <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No trades recorded yet</h3>
          <p>Complete your rules checklist and enter your first trade to get started.</p>
        </div>
      </div>
    );
  }

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winRate = (trades.filter(trade => trade.pnl > 0).length / trades.length) * 100;
  const avgWin = trades.filter(trade => trade.pnl > 0).reduce((sum, trade) => sum + trade.pnl, 0) / trades.filter(trade => trade.pnl > 0).length || 0;
  const avgLoss = trades.filter(trade => trade.pnl < 0).reduce((sum, trade) => sum + trade.pnl, 0) / trades.filter(trade => trade.pnl < 0).length || 0;

  const getBiasIcon = (bias: string) => {
    switch (bias) {
      case "Bullish":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "Bearish":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <ArrowRight className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDirectionBadge = (direction: string) => {
    return (
      <Badge variant={direction === "Long" ? "default" : "secondary"} className="flex items-center gap-1">
        {direction === "Long" ? 
          <TrendingUp className="h-3 w-3" /> : 
          <TrendingDown className="h-3 w-3" />
        }
        {direction}
      </Badge>
    );
  };

  const getPnLDisplay = (pnl: number) => {
    const isProfit = pnl >= 0;
    return (
      <span className={`font-medium ${isProfit ? 'text-profit' : 'text-loss'}`}>
        {isProfit ? '+' : ''}${pnl.toFixed(2)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-secondary border-trading-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-trading-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-foreground">{winRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-trading-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Win</p>
                <p className="text-2xl font-bold text-profit">+${avgWin.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-trading-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Loss</p>
                <p className="text-2xl font-bold text-loss">${avgLoss.toFixed(2)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trades Table */}
      <div className="border border-trading-border rounded-lg bg-trading-card">
        <Table>
          <TableHeader>
            <TableRow className="border-trading-border">
              <TableHead className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </TableHead>
              <TableHead>Bias</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>P&L</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>R:R</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id} className="border-trading-border hover:bg-accent/50">
                <TableCell>{trade.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getBiasIcon(trade.bias)}
                    {trade.bias}
                  </div>
                </TableCell>
                <TableCell>{getDirectionBadge(trade.direction)}</TableCell>
                <TableCell>{getPnLDisplay(trade.pnl)}</TableCell>
                <TableCell>${trade.riskAmount.toFixed(2)}</TableCell>
                <TableCell>
                  {trade.riskAmount > 0 ? `1:${(Math.abs(trade.pnl) / trade.riskAmount).toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTrade(trade)}
                    className="hover:bg-primary/10"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Trade Details Modal */}
      {selectedTrade && (
        <Card className="bg-trading-card border-trading-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Trade Details - {selectedTrade.date}
                {getPnLDisplay(selectedTrade.pnl)}
              </CardTitle>
              <Button variant="ghost" onClick={() => setSelectedTrade(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Market Context</h4>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded border border-trading-border">
                  {selectedTrade.marketContext}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Entry Reason</h4>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded border border-trading-border">
                  {selectedTrade.entryReason}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Exit Reason</h4>
              <p className="text-sm text-muted-foreground bg-secondary p-3 rounded border border-trading-border">
                {selectedTrade.exitReason}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>Rules Followed: {selectedTrade.rulesFollowed.filter(Boolean).length}/5</span>
              <span>Risk-Reward: 1:{(Math.abs(selectedTrade.pnl) / selectedTrade.riskAmount).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};