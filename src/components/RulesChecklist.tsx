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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trading Rules</h3>
        <div className="flex items-center gap-2">
          {allCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">
            {completedCount}/{completed.length} completed
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {defaultRules.map((rule, index) => (
          <Card key={index} className="p-4 bg-secondary border-trading-border hover:bg-accent/50 transition-colors">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={completed[index]}
                onCheckedChange={(checked) => handleRuleChange(index, checked as boolean)}
                className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${completed[index] ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {rule}
                </p>
                {index === 2 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Check this if you're NOT trading due to FOMO (Fear of Missing Out)
                  </p>
                )}
              </div>
              {completed[index] && (
                <CheckCircle2 className="h-4 w-4 text-success mt-1" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {allCompleted && (
        <Card className="p-4 bg-success/10 border-success/20">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium">All rules completed! You can now enter a trade.</p>
          </div>
        </Card>
      )}
    </div>
  );
};