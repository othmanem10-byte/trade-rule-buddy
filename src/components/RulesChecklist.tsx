import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

interface RulesChecklistProps {
  completed: boolean[];
  onChange: (completed: boolean[]) => void;
}

const defaultRules = [
  "High volume?",
  "Buying a premium after 6 pm?",
  "FOMO?",
  "Technical Analysis? Daily Bias?",
  "You have a reason to enter?"
];

export const RulesChecklist = ({ completed, onChange }: RulesChecklistProps) => {
  const handleRuleChange = (index: number, checked: boolean) => {
    const newCompleted = [...completed];
    newCompleted[index] = checked;
    onChange(newCompleted);
  };

  const allCompleted = completed.every(rule => rule);
  const completedCount = completed.filter(rule => rule).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <h3 className="text-xl font-bold text-foreground">TRADING RULES</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{completedCount}</div>
            <div className="text-sm text-muted-foreground">/ {completed.length}</div>
          </div>
          {allCompleted ? (
            <div className="p-2 rounded-full bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
          ) : (
            <div className="p-2 rounded-full bg-muted/10">
              <Circle className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {defaultRules.map((rule, index) => (
          <Card 
            key={index} 
            className={`
              relative p-5 transition-all duration-300 border-2
              ${completed[index] 
                ? 'glass-effect border-success/40 profit-shadow' 
                : 'glass-effect border-border/50 hover:border-primary/30'
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <Checkbox
                  checked={completed[index]}
                  onCheckedChange={(checked) => handleRuleChange(index, checked as boolean)}
                  className="h-5 w-5 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground border-2"
                />
              </div>
              <div className="flex-1">
                <p className={`text-base font-semibold transition-all duration-200 ${
                  completed[index] 
                    ? 'text-success line-through' 
                    : 'text-foreground'
                }`}>
                  {rule}
                </p>
                {index === 2 && (
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    ⚠️ Check this if you're NOT trading due to FOMO (Fear of Missing Out)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`
                  w-2 h-2 rounded-full transition-colors duration-200
                  ${completed[index] ? 'bg-success animate-pulse' : 'bg-muted-foreground/30'}
                `}></div>
                {completed[index] && (
                  <div className="p-1 rounded-full bg-success/10">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {allCompleted && (
        <Card className="relative p-6 profit-gradient border-success/40 trading-glow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-success/20">
              <CheckCircle2 className="h-8 w-8 text-success-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-success-foreground">ALL RULES COMPLETED!</p>
              <p className="text-success-foreground/80 font-medium">You are now authorized to enter a trade.</p>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success-foreground animate-pulse"></div>
                <span className="text-success-foreground font-bold">READY</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};