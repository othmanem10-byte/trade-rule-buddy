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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Market Context */}
          <div className="space-y-3">
            <Label htmlFor="marketContext" className="text-base font-semibold text-foreground flex items-center gap-2">
              📊 MARKET CONTEXT
            </Label>
            <Textarea
              id="marketContext"
              placeholder="Describe market conditions, key levels, economic events..."
              value={formData.marketContext}
              onChange={(e) => setFormData(prev => ({ ...prev, marketContext: e.target.value }))}
              className="glass-effect border-primary/30 min-h-24 text-base focus:border-primary/60 transition-all duration-200"
            />
          </div>

          {/* Entry Reason */}
          <div className="space-y-3">
            <Label htmlFor="entryReason" className="text-base font-semibold text-foreground flex items-center gap-2">
              🎯 ENTRY REASON
            </Label>
            <Textarea
              id="entryReason"
              placeholder="Why did you enter? What signals confirmed your decision?"
              value={formData.entryReason}
              onChange={(e) => setFormData(prev => ({ ...prev, entryReason: e.target.value }))}
              className="glass-effect border-accent/30 min-h-24 text-base focus:border-accent/60 transition-all duration-200"
            />
          </div>

          {/* Market Bias & Direction */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="bias" className="text-base font-semibold text-foreground">
                📈 BIAS
              </Label>
              <Select value={formData.bias} onValueChange={(value) => setFormData(prev => ({ ...prev, bias: value as any }))}>
                <SelectTrigger className="glass-effect border-success/30 h-12 text-base font-medium">
                  <SelectValue placeholder="Market bias" />
                </SelectTrigger>
                <SelectContent className="glass-effect">
                  <SelectItem value="Bullish" className="text-base font-medium">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-success" />
                      BULLISH
                    </div>
                  </SelectItem>
                  <SelectItem value="Bearish" className="text-base font-medium">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      BEARISH
                    </div>
                  </SelectItem>
                  <SelectItem value="Neutral" className="text-base font-medium">
                    <div className="flex items-center gap-3">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      NEUTRAL
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="direction" className="text-base font-semibold text-foreground">
                🔄 DIRECTION
              </Label>
              <Select value={formData.direction} onValueChange={(value) => setFormData(prev => ({ ...prev, direction: value as any }))}>
                <SelectTrigger className="glass-effect border-primary/30 h-12 text-base font-medium">
                  <SelectValue placeholder="Trade direction" />
                </SelectTrigger>
                <SelectContent className="glass-effect">
                  <SelectItem value="Long" className="text-base font-medium">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-success" />
                      LONG
                    </div>
                  </SelectItem>
                  <SelectItem value="Short" className="text-base font-medium">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      SHORT
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* P&L & Risk */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="pnl" className="text-base font-semibold text-foreground">
                💰 P&L ($)
              </Label>
              <Input
                id="pnl"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.pnl}
                onChange={(e) => setFormData(prev => ({ ...prev, pnl: e.target.value }))}
                className="glass-effect border-primary/30 h-12 text-base font-bold text-center focus:border-primary/60 transition-all duration-200"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="riskAmount" className="text-base font-semibold text-foreground">
                ⚡ RISK ($)
              </Label>
              <Input
                id="riskAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.riskAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, riskAmount: e.target.value }))}
                className="glass-effect border-destructive/30 h-12 text-base font-bold text-center focus:border-destructive/60 transition-all duration-200"
              />
            </div>
          </div>

          {/* Exit Reason */}
          <div className="space-y-3">
            <Label htmlFor="exitReason" className="text-base font-semibold text-foreground flex items-center gap-2">
              🚪 EXIT REASON
            </Label>
            <Textarea
              id="exitReason"
              placeholder="Why did you exit? Was it planned or emotional?"
              value={formData.exitReason}
              onChange={(e) => setFormData(prev => ({ ...prev, exitReason: e.target.value }))}
              className="glass-effect border-success/30 min-h-32 text-base focus:border-success/60 transition-all duration-200"
            />
          </div>

          {/* Risk Reward Display */}
          {formData.pnl && formData.riskAmount && (
            <Card className="p-4 glass-effect border-primary/30">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">RISK:REWARD RATIO</div>
                <div className="text-2xl font-bold text-primary">
                  1:{(Math.abs(parseFloat(formData.pnl)) / parseFloat(formData.riskAmount)).toFixed(2)}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button 
          type="submit" 
          className="w-full max-w-md h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 trading-glow"
        >
          🔥 RECORD TRADE
        </Button>
      </div>
    </form>
  );
};