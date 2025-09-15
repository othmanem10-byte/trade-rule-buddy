import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, ArrowRight, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import type { Trade } from "./TradingJournal";

interface TradesTableProps {
  trades: Trade[];
}

export const TradesTable = ({ trades }: TradesTableProps) => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const { toast } = useToast();

  const exportToExcel = () => {
    if (trades.length === 0) {
      toast({
        title: "No Data",
        description: "No trades to export.",
        variant: "destructive",
      });
      return;
    }

    // Prepare data for Excel
    const excelData = trades.map(trade => ({
      Date: trade.date,
      "Market Context": trade.marketContext,
      Bias: trade.bias,
      Direction: trade.direction,
      "P&L ($)": trade.pnl,
      "Risk Amount ($)": trade.riskAmount,
      "Risk-Reward Ratio": trade.riskAmount > 0 ? `1:${(Math.abs(trade.pnl) / trade.riskAmount).toFixed(2)}` : 'N/A',
      "Entry Reason": trade.entryReason,
      "Exit Reason": trade.exitReason,
      "High Volume": trade.rulesFollowed[0] ? "Yes" : "No",
      "Premium After 6pm": trade.rulesFollowed[1] ? "Yes" : "No",
      "FOMO": trade.rulesFollowed[2] ? "Yes" : "No",
      "Technical Analysis": trade.rulesFollowed[3] ? "Yes" : "No",
      "Had Reason to Enter": trade.rulesFollowed[4] ? "Yes" : "No",
      "Rules Followed": `${trade.rulesFollowed.filter(Boolean).length}/5`
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const colWidths = Object.keys(excelData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Trading Journal");

    // Generate filename with current date
    const filename = `trading-journal-${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

    toast({
      title: "Export Successful",
      description: `Trading journal exported as ${filename}`,
    });
  };

  if (trades.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 trading-glow rounded-full w-24 h-24 mx-auto"></div>
          <div className="relative p-6 rounded-full bg-muted/10 w-24 h-24 mx-auto flex items-center justify-center">
            <DollarSign className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">NO TRADES RECORDED</h3>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Complete your rules checklist and enter your first trade to begin tracking your performance.
          </p>
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
    <div className="space-y-8">
      {/* Professional Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`glass-effect border-2 transition-all duration-300 ${
          totalPnL >= 0 ? 'border-profit/40 profit-shadow' : 'border-loss/40 loss-shadow'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div className={`
                px-3 py-1 rounded-full text-xs font-bold
                ${totalPnL >= 0 ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'}
              `}>
                {totalPnL >= 0 ? 'PROFIT' : 'LOSS'}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">TOTAL P&L</p>
              <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 border-primary/40 trading-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className={`
                px-3 py-1 rounded-full text-xs font-bold
                ${winRate >= 50 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}
              `}>
                {winRate >= 50 ? 'GOOD' : 'POOR'}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">WIN RATE</p>
              <p className="text-3xl font-bold text-primary">{winRate.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 border-success/40 profit-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-success/20 text-success">
                WINS
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">AVG WIN</p>
              <p className="text-3xl font-bold text-success">+${avgWin.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 border-destructive/40 loss-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-destructive/10">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-destructive/20 text-destructive">
                LOSSES
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">AVG LOSS</p>
              <p className="text-3xl font-bold text-destructive">${avgLoss.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button 
          onClick={exportToExcel}
          className="flex items-center gap-3 h-12 px-6 text-base font-bold bg-success hover:bg-success/90 transition-all duration-300 trading-glow"
          disabled={trades.length === 0}
        >
          <Download className="h-5 w-5" />
          EXPORT TO EXCEL
        </Button>
      </div>

      {/* Professional Trading Table */}
      <div className="glass-effect border-2 border-primary/20 rounded-2xl overflow-hidden trading-shadow">
        <div className="bg-primary/5 px-6 py-4 border-b border-primary/20">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            📊 TRADE HISTORY
            <span className="text-lg text-muted-foreground">({trades.length} trades)</span>
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-primary/20 bg-muted/5">
              <TableHead className="h-14 text-base font-bold text-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  DATE
                </div>
              </TableHead>
              <TableHead className="h-14 text-base font-bold text-foreground">BIAS</TableHead>
              <TableHead className="h-14 text-base font-bold text-foreground">DIRECTION</TableHead>
              <TableHead className="h-14 text-base font-bold text-foreground">P&L</TableHead>
              <TableHead className="h-14 text-base font-bold text-foreground">RISK</TableHead>
              <TableHead className="h-14 text-base font-bold text-foreground">R:R</TableHead>
              <TableHead className="h-14 text-base font-bold text-foreground">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade, index) => (
              <TableRow 
                key={trade.id} 
                className={`
                  border-primary/10 hover:bg-primary/5 transition-all duration-200 h-16
                  ${trade.bias === 'Bullish' ? 'market-border-bull' : 
                    trade.bias === 'Bearish' ? 'market-border-bear' : 'market-border-neutral'}
                `}
              >
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {trade.date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getBiasIcon(trade.bias)}
                    <span className="font-semibold">{trade.bias}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={trade.direction === "Long" ? "default" : "secondary"} 
                    className={`
                      flex items-center gap-2 font-bold text-sm px-3 py-1
                      ${trade.direction === "Long" 
                        ? 'bg-success/20 text-success border-success/40' 
                        : 'bg-destructive/20 text-destructive border-destructive/40'
                      }
                    `}
                  >
                    {trade.direction === "Long" ? 
                      <TrendingUp className="h-4 w-4" /> : 
                      <TrendingDown className="h-4 w-4" />
                    }
                    {trade.direction.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className={`
                    text-lg font-bold px-3 py-1 rounded-lg
                    ${trade.pnl >= 0 
                      ? 'text-profit bg-profit/10' 
                      : 'text-loss bg-loss/10'
                    }
                  `}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  ${trade.riskAmount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span className="font-bold text-primary">
                    {trade.riskAmount > 0 ? `1:${(Math.abs(trade.pnl) / trade.riskAmount).toFixed(2)}` : 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTrade(trade)}
                    className="hover:bg-primary/10 border border-primary/20 font-medium"
                  >
                    VIEW DETAILS
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Trade Details Modal */}
      {selectedTrade && (
        <Card className="glass-effect border-2 border-accent/40 trading-shadow">
          <CardHeader className="bg-accent/5 border-b border-accent/20">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-4 text-2xl">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                TRADE DETAILS - {selectedTrade.date}
                <div className={`
                  text-xl font-bold px-4 py-2 rounded-lg
                  ${selectedTrade.pnl >= 0 
                    ? 'text-profit bg-profit/20' 
                    : 'text-loss bg-loss/20'
                  }
                `}>
                  {selectedTrade.pnl >= 0 ? '+' : ''}${selectedTrade.pnl.toFixed(2)}
                </div>
              </CardTitle>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedTrade(null)}
                className="h-10 w-10 rounded-full hover:bg-destructive/10 text-destructive"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  📊 MARKET CONTEXT
                </h4>
                <div className="glass-effect p-4 rounded-xl border border-primary/20">
                  <p className="text-base text-foreground leading-relaxed">
                    {selectedTrade.marketContext}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  🎯 ENTRY REASON
                </h4>
                <div className="glass-effect p-4 rounded-xl border border-accent/20">
                  <p className="text-base text-foreground leading-relaxed">
                    {selectedTrade.entryReason}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                🚪 EXIT REASON
              </h4>
              <div className="glass-effect p-4 rounded-xl border border-success/20">
                <p className="text-base text-foreground leading-relaxed">
                  {selectedTrade.exitReason}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 glass-effect rounded-xl border border-primary/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedTrade.rulesFollowed.filter(Boolean).length}/5
                </div>
                <div className="text-sm text-muted-foreground font-medium">RULES FOLLOWED</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  1:{(Math.abs(selectedTrade.pnl) / selectedTrade.riskAmount).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground font-medium">RISK:REWARD</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  selectedTrade.direction === 'Long' ? 'text-success' : 'text-destructive'
                }`}>
                  {selectedTrade.direction.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground font-medium">DIRECTION</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};