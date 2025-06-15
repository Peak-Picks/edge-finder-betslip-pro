
export const propsByLeague = {
  nba: [
    {
      player: "Luka Dončić",
      team: "DAL",
      matchup: "vs LAL",
      props: [
        { type: "Points", line: 28.5, odds: "-110", edge: 11.2 },
        { type: "Rebounds", line: 8.5, odds: "+105", edge: 7.8 },
        { type: "Assists", line: 8.5, odds: "-115", edge: 5.4 }
      ]
    },
    {
      player: "Jayson Tatum",
      team: "BOS",
      matchup: "vs MIA",
      props: [
        { type: "Points", line: 26.5, odds: "-110", edge: 9.1 },
        { type: "3-Pointers", line: 3.5, odds: "+120", edge: 12.3 }
      ]
    },
    {
      player: "Giannis Antetokounmpo",
      team: "MIL",
      matchup: "vs PHI",
      props: [
        { type: "Points", line: 30.5, odds: "-105", edge: 8.7 },
        { type: "Rebounds", line: 11.5, odds: "+110", edge: 6.9 }
      ]
    }
  ],
  nfl: [
    {
      player: "Josh Allen",
      team: "BUF",
      matchup: "vs KC",
      props: [
        { type: "Passing Yards", line: 267.5, odds: "-115", edge: 9.4 },
        { type: "Passing TDs", line: 2.5, odds: "+105", edge: 7.2 },
        { type: "Rushing Yards", line: 35.5, odds: "+110", edge: 6.8 }
      ]
    },
    {
      player: "Patrick Mahomes",
      team: "KC",
      matchup: "@ BUF",
      props: [
        { type: "Passing Yards", line: 275.5, odds: "-110", edge: 11.8 },
        { type: "Passing TDs", line: 2.5, odds: "-105", edge: 8.9 },
        { type: "Rushing Yards", line: 15.5, odds: "+125", edge: 8.3 }
      ]
    },
    {
      player: "Tyreek Hill",
      team: "MIA",
      matchup: "vs NYJ",
      props: [
        { type: "Receiving Yards", line: 78.5, odds: "-110", edge: 7.5 },
        { type: "Receptions", line: 6.5, odds: "+105", edge: 5.9 }
      ]
    }
  ],
  mlb: [
    {
      player: "Mookie Betts",
      team: "LAD",
      matchup: "vs SF",
      props: [
        { type: "Hits", line: 1.5, odds: "+110", edge: 6.7 },
        { type: "Total Bases", line: 2.5, odds: "-105", edge: 4.9 },
        { type: "Runs + RBIs", line: 1.5, odds: "-115", edge: 8.2 }
      ]
    },
    {
      player: "Aaron Judge",
      team: "NYY",
      matchup: "@ BOS",
      props: [
        { type: "Home Runs", line: 0.5, odds: "+180", edge: 12.4 },
        { type: "Hits", line: 1.5, odds: "-105", edge: 5.3 },
        { type: "RBIs", line: 1.5, odds: "+120", edge: 7.1 }
      ]
    }
  ]
};
