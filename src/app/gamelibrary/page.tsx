import getServerSession from "next-auth";
import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import GameLibraryClient from "./GameLibraryClient";

export default async function GameLibraryPage() {
  const session = await getServerSession(authOptions);
  const games = await prisma.game.findMany({ orderBy: { title: "asc" } });

  let initialLibraryIds: string[] = [];

  // If user is logged in, fetch their favorites library to get list of game IDs in their favorites for initial state.
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { library: { select: { gameId: true } } },
    });
    initialLibraryIds = user?.library.map((l) => l.gameId) ?? [];
  }
  
  // Returns full GameLibraryClient component with games and initial library IDs passed as props.
  return <GameLibraryClient games={JSON.parse(JSON.stringify(games))} initialLibraryIds={initialLibraryIds}/>;
};
