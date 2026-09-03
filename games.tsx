import { createFileRoute } from "@tanstack/react-router";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";
import { Page } from "@/components/layout/app-shell";
import { GameArena } from "@/components/games/arena";

export const Route = createFileRoute("/games")({ component: GamesPage });

function GamesPage() {
  const lang = useHub((s) => s.lang);
  const ui = t(lang);
  return (
    <Page kicker={ui.nav.games} title={ui.gamesTitle} description={ui.gamesP}>
      <GameArena />
    </Page>
  );
}
