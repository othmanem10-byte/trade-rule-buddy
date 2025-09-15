import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Trade } from "./TradingJournal";

interface TradeEntryFormProps {
  onSubmit: (trade: Omit<Trade, "id" | "date" | "rulesFollowed">) => void;
}

export const TradeEntryForm = ({ onSubmit }: TradeEntryFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    marketContext: "",
    bias: "" as "Bullish" | "Bearish" | "Neutral" | "",
    direction: "" as "Long" | "Short" | "",
    pnl: "",
    riskAmount: "",
    entryReason: "",
    exitReason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.marketContext || !formData.bias || !formData.direction || 
        !formData.pnl || !formData.riskAmount || !formData.entryReason || !formData.exitReason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      marketContext: formData.marketContext,
      bias: formData.bias as "Bullish" | "Bearish" | "Neutral",
      direction: formData.direction as "Long" | "Short",
      pnl: parseFloat(formData.pnl),
      riskAmount: parseFloat(formData.riskAmount),
      entryReason: formData.entryReason,
      exitReason: formData.exitReason,
    });

    // Reset form
    setFormData({
      marketContext: "",
      bias: "",
      direction: "",
      pnl: "",
      riskAmount: "",
      entryReason: "",
      exitReason: "",
    });

    toast({
      title: "Trade Recorded",
      description: "Your trade has been successfully added to the journal.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market Context */}
        <div className="space-y-2">
          <Label htmlFor="marketContext">Market Context</Label>
          <Textarea
            id="marketContext"
            placeholder="Describe the overall market conditions, key levels, news events..."
            value={formData.marketContext}
            onChange={(e) => setFormData(prev => ({ ...prev, marketContext: e.target.value }))}
            className="bg-input border-trading-border min-h-20"
          />
        </div>

        {/* Entry Reason */}
        <div className="space-y-2">
          <Label htmlFor="entryReason">Entry Reason</Label>
          <Textarea
            id="entryReason"
            placeholder="Why did you enter this trade? What signals did you see?"
            value={formData.entryReason}
            onChange={(e) => setFormData(prev => ({ ...prev, entryReason: e.target.value }))}
            className="bg-input border-trading-border min-h-20"
          />
        </div>

        {/* Bias */}
        <div className="space-y-2">
          <Label htmlFor="bias">Market Bias</Label>
          <Select value={formData.bias} onValueChange={(value) => setFormData(prev => ({ ...prev, bias: value as any }))}>
            <SelectTrigger className="bg-input border-trading-border">
              <SelectValue placeholder="Select market bias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bullish">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  Bullish
                </div>
              </SelectItem>
              <SelectItem value="Bearish">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  Bearish
                </div>
              </SelectItem>
              <SelectItem value="Neutral">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  Neutral
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Direction */}
        <div className="space-y-2">
          <Label htmlFor="direction">Trade Direction</Label>
          <Select value={formData.direction} onValueChange={(value) => setFormData(prev => ({ ...prev, direction: value as any }))}>
            <SelectTrigger className="bg-input border-trading-border">
              <SelectValue placeholder="Long or Short" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Long">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  Long
                </div>
              </SelectItem>
              <SelectItem value="Short">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  Short
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* P&L */}
        <div className="space-y-2">
          <Label htmlFor="pnl">P&L ($)</Label>
          <Input
            id="pnl"
            type="number"
            step="0.01"
            placeholder="Enter profit/loss amount"
            value={formData.pnl}
            onChange={(e) => setFormData(prev => ({ ...prev, pnl: e.target.value }))}
            className="bg-input border-trading-border"
          />
        </div>

        {/* Risk Amount */}
        <div className="space-y-2">
          <Label htmlFor="riskAmount">Risk Amount ($)</Label>
          <Input
            id="riskAmount"
            type="number"
            step="0.01"
            placeholder="How much did you risk?"
            value={formData.riskAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, riskAmount: e.target.value }))}
            className="bg-input border-trading-border"
          />
        </div>
      </div>

      {/* Exit Reason */}
      <div className="space-y-2">
        <Label htmlFor="exitReason">Exit Reason</Label>
        <Textarea
          id="exitReason"
          placeholder="Why did you exit this trade? Was it planned or emotional?"
          value={formData.exitReason}
          onChange={(e) => setFormData(prev => ({ ...prev, exitReason: e.target.value }))}
          className="bg-input border-trading-border"
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Record Trade
      </Button>
    </form>
  );
};