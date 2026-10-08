import { Activity, CircleDot, Disc, Dumbbell, Grid, Shield, Trophy } from "lucide-react";

export function SportIcon({ sport, className = "h-4 w-4" }: { sport: string; className?: string }) {
  switch (sport.toLowerCase()) {
    case "badminton":
      return <Activity className={className} />;
    case "squash":
      return <CircleDot className={className} />;
    case "tabletennis":
      return <Disc className={className} />;
    case "basketball":
      return <Dumbbell className={className} />;
    case "cricket":
      return <Shield className={className} />;
    case "chess":
      return <Grid className={className} />;
    default:
      return <Trophy className={className} />;
  }
}
