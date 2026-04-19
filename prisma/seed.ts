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

const playerList = [
  {
    username: "ZeBass",
    imageUrl: "https://pbs.twimg.com/profile_images/1278566466082574336/-kjvFHAS_400x400.jpg",
    game: "Overwatch 2",
    rank: "Gold",
  },
  {
    username: "Mathedealer1",
    imageUrl: "https://pbs.twimg.com/profile_images/1448767886147796992/ajwp5OkK_400x400.jpg",
    game: "Valorant",
    rank: "Platinum",
  },
  {
    username: "koldqt",
    imageUrl: "https://pbs.twimg.com/profile_images/2041633459760963584/1D_5n0o3_400x400.jpg",
    game: "Valorant",
    rank: "Gold",
  },
  {
    username: "Tesidn",
    imageUrl: "https://pbs.twimg.com/profile_images/1516725783863062531/BxrqeNqA_400x400.jpg",
    game: "Valorant",
    rank: "Silver",
  },
  {
    username: "bazingahi50",
    imageUrl: "https://media.licdn.com/dms/image/v2/C4D03AQGmJwN3A7jqoQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1606074819411?e=2147483647&v=beta&t=m0J9ATpipaJ2iMhTTnj4nqCnL_qqvhKRsQ5hJHiXE08",
    game: "Valorant",
    rank: "Silver",
  },
  {
    username: "bullzye",
    imageUrl: "https://i.pinimg.com/736x/31/33/12/313312899252ca116155d9c8e173a962.jpg",
    game: "Counter-Strike 2",
    rank: "Gold Nova",
  },
];

const communityServers = [
  {
    name: 'UH Esports',
    description: 'Official University of Hawaiʻi esports community server.',
    inviteUrl: 'https://discord.gg/uhesports',
    tags: ['UH', 'Esports', 'Campus', 'Official', 'Events'],
    imageUrl: '/servers/uh-esports.webp',
    featured: true,
  },
  {
    name: 'Women of UH Esports',
    description: 'Women of UH Esports community server.',
    inviteUrl: 'https://discord.gg/jPRujZtnmz',
    tags: ['UH', 'Esports', 'Community', 'Campus', 'Official'],
    imageUrl: '/servers/wouhe.webp',
    featured: true,
  },
  {
    name: 'Manoa Academy of Gamers',
    description: 'The goal of MAG is to provide a safe and comfortable space for people to play games, as well as make connections and acknowledge that gaming and college life can be mutually beneficial to students’ success in assimilating into college life at UHM.',
    inviteUrl: 'https://discord.gg/jHrrdW4dnN',
    tags: ['UH', 'Esports','Community', 'Campus', 'Student Organization'],
    imageUrl: '/servers/manoa-academy-of-gamers.webp',
    featured: true,
  },
  /* {
    name: 'Apex Legends',
    description: 'Official community-run, developer-supported Apex Legends server.',
    inviteUrl: 'https://discord.gg/apexlegends',
    tags: ['Apex Legends', 'Official'],
    imageUrl: null,
    featured: false,
  },
  {
    name: 'Official Fortnite',
    description: 'Official Fortnite Discord server for news, updates, and LFG.',
    inviteUrl: 'https://discord.gg/fortnite',
    tags: ['Fortnite', 'Official'],
    imageUrl: null,
    featured: false,
  },
  {
    name: 'Genshin Impact Official',
    description: 'Official Genshin Impact Discord server.',
    inviteUrl: 'https://discord.gg/genshinimpact',
    tags: ['Genshin Impact', 'Official'],
    imageUrl: null,
    featured: false,
  },
  {
    name: 'League of Legends',
    description: 'Official League of Legends Discord server run in collaboration with Riot Games.',
    inviteUrl: 'https://discord.gg/leagueoflegends',
    tags: ['League of Legends', 'Official'],
    imageUrl: null,
    featured: false,
  },
  {
    name: 'MINECRAFT',
    description: 'Official Minecraft Discord server.',
    inviteUrl: 'https://discord.gg/minecraft',
    tags: ['Minecraft', 'Official'],
    imageUrl: null,
    featured: false,
  },
  {
    name: 'Rocket League',
    description: 'Official, developer-run Rocket League Discord server.',
    inviteUrl: 'https://discord.gg/rocketleague',
    tags: ['Rocket League', 'Official'],
    imageUrl: null,
    featured: false,
  },
  {
    name: 'Stardew Valley',
    description: 'Main Stardew Valley community server.',
    inviteUrl: 'https://discord.gg/stardewvalley',
    tags: ['Stardew Valley', 'Community'],
    imageUrl: null,
    featured: false,
  },
  {
    name: 'VALORANT',
    description: 'Official VALORANT Discord server in collaboration with Riot Games.',
    inviteUrl: 'https://discord.gg/valorant',
    tags: ['Valorant', 'Official'],
    imageUrl: null,
    featured: false,
  },
  */
];

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
  for (const player of playerList) {
    console.log(`  Adding player: ${player.username}`);

    await prisma.player.upsert({
      where: { username: player.username },
      update: {
        imageUrl: player.imageUrl,
        game: player.game,
        rank: player.rank,
      },
      create: {
        username: player.username,
        imageUrl: player.imageUrl,
        game: player.game,
        rank: player.rank,
      },
    });
  }
  for (const server of communityServers) {
    console.log(`  Adding community server: ${server.name}`);

    await prisma.communityServer.upsert({
      where: { name: server.name },
      update: {
        description: server.description,
        inviteUrl: server.inviteUrl,
        tags: server.tags,
        imageUrl: server.imageUrl,
        featured: server.featured,
      },
      create: {
        name: server.name,
        description: server.description,
        inviteUrl: server.inviteUrl,
        tags: server.tags,
        imageUrl: server.imageUrl,
        featured: server.featured,
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