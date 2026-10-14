import { Activity, CircleDot, Disc, Dumbbell, Grid, Shield, Trophy } from "lucide-react";
import React from "react";

export function SportIcon({
  sport,
  className = "h-4 w-4",
  style,
}: {
  sport: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  switch (sport.toLowerCase()) {
    case "badminton":
      return <Activity className={className} style={style} />;
    case "squash":
      return <CircleDot className={className} style={style} />;
    case "tabletennis":
      return <Disc className={className} style={style} />;
    case "basketball":
      return <Dumbbell className={className} style={style} />;
    case "cricket":
      return <Shield className={className} style={style} />;
    case "chess":
      return <Grid className={className} style={style} />;
    default:
      return <Trophy className={className} style={style} />;
  }
}
