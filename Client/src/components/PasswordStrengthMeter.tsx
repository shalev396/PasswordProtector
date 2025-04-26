import { useMemo } from "react";
import { cn } from "@/lib/utils"; // Assuming cn utility exists

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;

    // Length bonus
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character type bonus
    if (/[A-Z]/.test(password)) score += 1; // Uppercase
    if (/[a-z]/.test(password)) score += 1; // Lowercase
    if (/[0-9]/.test(password)) score += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Symbols

    // Simple normalization (adjust logic as needed for more sophisticated scoring)
    return Math.min(4, Math.floor(score / 1.75)); // Scale score to 0-4 range (adjust divisor for sensitivity)
  }, [password]);

  const strengthText = useMemo(() => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  }, [strength]);

  const strengthColor = useMemo(() => {
    switch (strength) {
      case 0:
        return "bg-destructive";
      case 1:
        return "bg-warning";
      case 2:
        return "bg-warning";
      case 3:
        return "bg-success/80";
      case 4:
        return "bg-success";
      default:
        return "bg-muted";
    }
  }, [strength]);

  const textColor = useMemo(() => {
    switch (strength) {
      case 0:
        return "text-destructive";
      case 1:
        return "text-warning";
      case 2:
        return "text-warning";
      case 3:
        return "text-success/80";
      case 4:
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  }, [strength]);

  return (
    <div className="space-y-1 pt-1">
      {/* Strength bar */}
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
        {/* Create 4 segments for the bar */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-full transition-all duration-300 ease-in-out",
              // Width is proportional, ensure sum is w-full (4 * w-1/4)
              "w-1/4",
              // Apply color only if strength is high enough for this segment
              i < strength ? strengthColor : "bg-muted/50",
              // Add slight gap between segments if needed
              i > 0 ? "ml-0.5" : ""
            )}
          />
        ))}
      </div>
      {/* Strength label */}
      {password && (
        <div className="flex justify-end text-xs">
          <span className={cn("font-medium", textColor)}>{strengthText}</span>
        </div>
      )}
    </div>
  );
}
