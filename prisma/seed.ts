import "dotenv/config";
console.log("DATABASE_URL:", process.env.DATABASE_URL);

import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcrypt";
import * as config from "../config/settings.development.json";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const defaultGames = [
  {
    title: "Apex Legends",
    developer: "Respawn Entertainment",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["Battle Royale", "FPS", "Hero Shooter"],
    description: "A squad-based battle royale shooter with unique character abilities.",
    imageUrl: "/gamesLib/apex-legends.webp",
  },
  {
    title: "Counter-Strike 2",
    developer: "Valve",
    platform: "PC",
    tags: ["FPS", "Tactical Shooter", "Competitive"],
    description: "A competitive tactical first-person shooter focused on team-based objective play.",
    imageUrl: "/gamesLib/counter-strike-2.png",
  },
  {
    title: "Fortnite",
    developer: "Epic Games",
    platform: "PC / PlayStation / Xbox / Switch / Mobile",
    tags: ["Battle Royale", "Shooter", "Survival"],
    description: "A fast-paced battle royale game known for building mechanics and live events.",
    imageUrl: "/gamesLib/fortnite.png",
  },
  {
    title: "Genshin Impact",
    developer: "miHoYo",
    platform: "PC / PlayStation / Mobile",
    tags: ["Action RPG", "Open World", "Adventure"],
    description: "An open-world action RPG centered on exploration, elemental combat, and story quests.",
    imageUrl: "/gamesLib/genshin-impact.png",
  },
  {
    title: "League of Legends",
    developer: "Riot Games",
    platform: "PC",
    tags: ["MOBA", "Strategy", "Competitive"],
    description: "A competitive multiplayer online battle arena game with a large roster of champions.",
    imageUrl: "/gamesLib/league-of-legends.png",
  },
  {
    title: "Minecraft",
    developer: "Mojang Studios",
    platform: "Multi-platform",
    tags: ["Sandbox", "Survival", "Creative", "Adventure"],
    description: "A sandbox game built around exploration, crafting, building, and survival.",
    imageUrl: "/gamesLib/minecraft.webp",
  },
  {
    title: "Overwatch 2",
    developer: "Blizzard Entertainment",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["Hero Shooter", "FPS", "Team-Based"],
    description: "A team-based hero shooter focused on objective play and character abilities.",
    imageUrl: "/gamesLib/overwatch-2.png",
  },
  {
    title: "Rocket League",
    developer: "Psyonix",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["Sports", "Racing", "Competitive"],
    description: "A high-speed competitive game that mixes soccer with rocket-powered cars.",
    imageUrl: "/gamesLib/rocket-league.png",
  },
  {
    title: "Stardew Valley",
    developer: "ConcernedApe",
    platform: "PC / PlayStation / Xbox / Switch / Mobile",
    tags: ["Farming Sim", "RPG", "Life Sim", "Indie"],
    description: "A farming and life simulation game focused on building a farm and connecting with a town.",
    imageUrl: "/gamesLib/stardew-valley.png",
  },
  {
    title: "Super Smash Bros. Ultimate",
    developer: "Bandai Namco Studios / Sora Ltd.",
    platform: "Nintendo Switch",
    tags: ["Fighting", "Party", "Competitive"],
    description: "A crossover platform fighting game featuring characters from many major franchises.",
    imageUrl: "/gamesLib/super-smash-bros.png",
  },
  {
    title: "Valorant",
    developer: "Riot Games",
    platform: "PC",
    tags: ["FPS", "Tactical Shooter", "Competitive", "Hero Shooter"],
    description: "A 5v5 tactical hero shooter built around precise gunplay and agent abilities.",
    imageUrl: "/gamesLib/valorant.webp",
  },
];

/**
 * Seed profile data keyed by user email.
 * The email must match one of the accounts in config.defaultAccounts.
 */
const defaultProfiles: Record<
  string,
  { description: string; interests: string; profilePicture: string | null }
> = {
  "admin@foo.com": {
    description: "UH GameLink admin account.",
    interests: "Gaming communities, moderation, site testing",
    profilePicture: "/default-profile.png",
  },
  "john@foo.com": {
    description: "Casual and competitive gamer looking for people to queue with.",
    interests: "Valorant, Apex Legends, League of Legends",
    profilePicture: "/default-profile.png",
  },
  "jane@foo.com": {
    description: "Enjoys co-op games and meeting new players around campus.",
    interests: "Minecraft, Stardew Valley, Overwatch 2",
    profilePicture: "/default-profile.png",
  },
};

async function main() {
  console.log("Seeding the database");

  const password = await hash("changeme", 10);

  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);

    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        password,
        role,
      },
      create: {
        email: account.email,
        password,
        role,
      },
    });

    const profileSeed = defaultProfiles[account.email] ?? {
      description: `Hi, I'm ${account.email.split("@")[0]} and I'm looking for other UH GameLink users to play with.`,
      interests: "Gaming, meeting new people, campus community",
      profilePicture: "/default-profile.png",
    };

    console.log(`  Creating/updating profile for: ${account.email}`);

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        description: profileSeed.description,
        interests: profileSeed.interests,
        profilePicture: profileSeed.profilePicture,
      },
      create: {
        description: profileSeed.description,
        interests: profileSeed.interests,
        profilePicture: profileSeed.profilePicture,
        userId: user.id,
      },
    });
  }

  for (const game of defaultGames) {
    console.log(`  Adding game: ${game.title}`);

    await prisma.game.upsert({
      where: { title: game.title },
      update: {
        developer: game.developer,
        platform: game.platform,
        tags: game.tags,
        description: game.description,
        imageUrl: game.imageUrl,
      },
      create: {
        title: game.title,
        developer: game.developer,
        platform: game.platform,
        tags: game.tags,
        description: game.description,
        imageUrl: game.imageUrl,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });