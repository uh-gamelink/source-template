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
      imageUrl: "/gamesLib/minecraft.jpg",
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
    { //second addition of games
      title: "Among Us",
      developer: "Innersloth",
      platform: "PC / PlayStation / Xbox / Switch / Mobile",
      tags: ["Social Deduction", "Party", "Co-op"],
      description: "A social deduction game where crewmates complete tasks while impostors try to eliminate them.",
      imageUrl: "/gamesLib/among-us.png",
    },
    {
      title: "ARK: Survival Evolved",
      developer: "Studio Wildcard",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["Survival", "Open World", "Co-op"],
      description: "A survival game where players tame dinosaurs, build bases, and explore dangerous prehistoric worlds.",
      imageUrl: "/gamesLib/ark.avif",
    },
    {
      title: "Baldur's Gate 3",
      developer: "Larian Studios",
      platform: "PC / PlayStation / Xbox",
      tags: ["RPG", "Turn-Based", "Co-op"],
      description: "A story-driven fantasy RPG with turn-based combat, character choices, and cooperative party play.",
      imageUrl: "/gamesLib/baldurs-gate.avif",
    },
    {
      title: "Battlefield",
      developer: "DICE",
      platform: "PC / PlayStation / Xbox",
      tags: ["FPS", "Large-Scale Battles", "Competitive"],
      description: "A first-person shooter series known for large maps, vehicles, squads, and objective-based combat.",
      imageUrl: "/gamesLib/battlefield.jpeg",
    },
    {
      title: "The Binding of Isaac",
      developer: "Edmund McMillen",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["Roguelike", "Dungeon Crawler", "Co-op"],
      description: "A dark roguelike dungeon crawler with randomized rooms, items, enemies, and chaotic co-op gameplay.",
      imageUrl: "/gamesLib/binding-of-isaac.avif",
    },
    {
      title: "Brawlhalla",
      developer: "Blue Mammoth Games",
      platform: "PC / PlayStation / Xbox / Switch / Mobile",
      tags: ["Platform Fighter", "Fighting", "Competitive"],
      description: "A free-to-play platform fighting game where players battle using weapons, movement, and stage control.",
      imageUrl: "/gamesLib/brawlhalla.png",
    },
    {
      title: "Dead by Daylight",
      developer: "Behaviour Interactive",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["Horror", "Survival", "Co-op"],
      description: "An asymmetrical horror game where survivors work together to escape while one killer hunts them down.",
      imageUrl: "/gamesLib/dead-by-daylight.png",
    },
    {
      title: "Divinity: Original Sin 2",
      developer: "Larian Studios",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["RPG", "Turn-Based", "Co-op"],
      description: "A fantasy RPG with deep character builds, turn-based combat, and cooperative story progression.",
      imageUrl: "/gamesLib/divinity-2.webp",
    },
    {
      title: "Dota 2",
      developer: "Valve",
      platform: "PC",
      tags: ["MOBA", "Strategy", "Competitive"],
      description: "A competitive MOBA where two teams battle to destroy the enemy Ancient using heroes with unique abilities.",
      imageUrl: "/gamesLib/dota-2.jpg",
    },
    {
      title: "Elden Ring",
      developer: "FromSoftware",
      platform: "PC / PlayStation / Xbox",
      tags: ["Action RPG", "Open World", "Co-op"],
      description: "An open-world action RPG with challenging combat, exploration, boss fights, and online cooperative play.",
      imageUrl: "/gamesLib/elden-ring.webp",
    },
    {
      title: "Escape from Tarkov",
      developer: "Battlestate Games",
      platform: "PC",
      tags: ["Extraction Shooter", "FPS", "Competitive"],
      description: "A hardcore extraction shooter focused on survival, looting, tactical combat, and high-risk raids.",
      imageUrl: "/gamesLib/escape-from-tarkov.jpg",
    },
    {
      title: "Fall Guys",
      developer: "Mediatonic",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["Party", "Platformer", "Competitive"],
      description: "A chaotic party platformer where players race through obstacle courses and elimination-style minigames.",
      imageUrl: "/gamesLib/fall-guys.png",
    },
    {
      title: "EA Sports FC 26",
      developer: "EA Sports",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["Sports", "Soccer", "Competitive"],
      description: "A soccer simulation game focused on team building, online matches, and competitive football gameplay.",
      imageUrl: "/gamesLib/fc-26.webp",
    },
    {
      title: "Final Fantasy XIV",
      developer: "Square Enix",
      platform: "PC / PlayStation / Xbox",
      tags: ["MMORPG", "Fantasy", "Co-op"],
      description: "A fantasy MMORPG with story quests, dungeons, raids, crafting, and large-scale online adventures.",
      imageUrl: "/gamesLib/final-fantasy.png",
    },
    {
      title: "Forza",
      developer: "Turn 10 Studios",
      platform: "PC / Xbox",
      tags: ["Racing", "Simulation", "Competitive"],
      description: "A racing series featuring realistic driving, customizable cars, and competitive online races.",
      imageUrl: "/gamesLib/forza.png",
    },
    {
      title: "Halo Infinite",
      developer: "343 Industries",
      platform: "PC / Xbox",
      tags: ["FPS", "Arena Shooter", "Competitive"],
      description: "A sci-fi first-person shooter with arena combat, ranked matches, and cooperative campaign options.",
      imageUrl: "/gamesLib/halo-infinite.png",
    },
    {
      title: "Monster Hunter",
      developer: "Capcom",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["Action RPG", "Hunting", "Co-op"],
      description: "An action RPG series where players hunt massive monsters, craft gear, and team up for challenging quests.",
      imageUrl: "/gamesLib/monster-hunter.png",
    },
    {
      title: "MultiVersus",
      developer: "Player First Games",
      platform: "PC / PlayStation / Xbox",
      tags: ["Platform Fighter", "Fighting", "Competitive"],
      description: "A platform fighting game featuring team-based battles with characters from different Warner Bros. properties.",
      imageUrl: "/gamesLib/multiversus.avif",
    },
    {
      title: "Paladins",
      developer: "Evil Mojo Games",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["Hero Shooter", "FPS", "Competitive"],
      description: "A team-based hero shooter with customizable champions, abilities, and objective-focused matches.",
      imageUrl: "/gamesLib/paladins.png",
    },
    {
      title: "Phasmophobia",
      developer: "Kinetic Games",
      platform: "PC / PlayStation / Xbox",
      tags: ["Horror", "Investigation", "Co-op"],
      description: "A cooperative horror game where players investigate haunted locations and identify different types of ghosts.",
      imageUrl: "/gamesLib/phasmophobia.jpg",
    },
    {
      title: "PUBG: Battlegrounds",
      developer: "KRAFTON",
      platform: "PC / PlayStation / Xbox / Mobile",
      tags: ["Battle Royale", "Shooter", "Competitive"],
      description: "A battle royale shooter where players loot, survive, and fight to be the last team standing.",
      imageUrl: "/gamesLib/pubg.jpg",
    },
    {
      title: "Rainbow Six Siege",
      developer: "Ubisoft Montreal",
      platform: "PC / PlayStation / Xbox",
      tags: ["Tactical Shooter", "FPS", "Competitive"],
      description: "A tactical first-person shooter focused on operators, destructible environments, and team-based strategy.",
      imageUrl: "/gamesLib/rainbow-6.jpg",
    },
    {
      title: "Risk of Rain 2",
      developer: "Hopoo Games",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["Roguelike", "Third-Person Shooter", "Co-op"],
      description: "A roguelike third-person shooter where players fight waves of enemies, collect items, and survive escalating difficulty.",
      imageUrl: "/gamesLib/risk-of-rain-2.png",
    },
    {
      title: "Rust",
      developer: "Facepunch Studios",
      platform: "PC / PlayStation / Xbox",
      tags: ["Survival", "Open World", "Competitive"],
      description: "A harsh survival game where players gather resources, build bases, raid enemies, and fight to stay alive.",
      imageUrl: "/gamesLib/rust.png",
    },
    {
      title: "Sea of Thieves",
      developer: "Rare",
      platform: "PC / Xbox / PlayStation",
      tags: ["Adventure", "Pirates", "Co-op"],
      description: "A pirate adventure game where crews sail ships, hunt treasure, battle enemies, and explore the open sea.",
      imageUrl: "/gamesLib/sea-of-thieves.jpg",
    },
    {
      title: "SMITE",
      developer: "Titan Forge Games",
      platform: "PC / PlayStation / Xbox / Switch",
      tags: ["MOBA", "Action", "Competitive"],
      description: "A third-person MOBA where players control gods and mythological figures in team-based arena combat.",
      imageUrl: "/gamesLib/smite.png",
    },
    {
      title: "Terraria",
      developer: "Re-Logic",
      platform: "PC / PlayStation / Xbox / Switch / Mobile",
      tags: ["Sandbox", "Adventure", "Co-op"],
      description: "A 2D sandbox adventure game focused on building, crafting, exploration, bosses, and cooperative survival.",
      imageUrl: "/gamesLib/terraria.webp",
    },
    {
      title: "Team Fortress 2",
      developer: "Valve",
      platform: "PC",
      tags: ["Hero Shooter", "FPS", "Competitive"],
      description: "A class-based first-person shooter with objective modes, unique roles, and fast-paced team combat.",
      imageUrl: "/gamesLib/tf2.jpg",
    },
    {
      title: "Call of Duty: Warzone",
      developer: "Raven Software",
      platform: "PC / PlayStation / Xbox",
      tags: ["Battle Royale", "FPS", "Competitive"],
      description: "A battle royale shooter with fast-paced gunplay, squad tactics, loadouts, and large-scale combat.",
      imageUrl: "/gamesLib/warzone.webp",
    },
    {
      title: "World of Warcraft",
      developer: "Blizzard Entertainment",
      platform: "PC",
      tags: ["MMORPG", "Fantasy", "Co-op"],
      description: "A fantasy MMORPG where players complete quests, run dungeons, join raids, and explore a massive online world.",
      imageUrl: "/gamesLib/world-of-warcraft.jpg",
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
  {
    name: 'Apex Legends',
    description: 'Official community-run, developer-supported Apex Legends server.',
    inviteUrl: 'https://discord.gg/apexlegends',
    tags: ['Apex Legends', 'Official'],
    imageUrl: '/servers/apex-legends.webp',
    featured: false,
  },
  {
    name: 'Counter-Strike Discord | CSGO & CS2',
    description: 'Official Counter-Strike Discord server for news, updates, and LFG.',
    inviteUrl: 'https://discord.gg/counterstrike',
    tags: ['Counter-Strike', 'Official'],
    imageUrl: '/servers/cs2.webp',
    featured: false,
  },
  {
    name: 'Official Fortnite',
    description: 'Official Fortnite Discord server for news, updates, and LFG.',
    inviteUrl: 'https://discord.gg/fortnite',
    tags: ['Fortnite', 'Official'],
    imageUrl: '/servers/fortnite.webp',
    featured: false,
  },
  {
    name: 'Genshin Impact Official',
    description: 'Official Genshin Impact Discord server.',
    inviteUrl: 'https://discord.gg/genshinimpact',
    tags: ['Genshin Impact', 'Official'],
    imageUrl: '/servers/genshin-impact.webp',
    featured: false,
  },
  {
    name: 'League of Legends',
    description: 'Official League of Legends Discord server run in collaboration with Riot Games.',
    inviteUrl: 'https://discord.gg/leagueoflegends',
    tags: ['League of Legends', 'Official'],
    imageUrl: '/servers/league-of-legends.webp',
    featured: false,
  },
  {
    name: 'MINECRAFT',
    description: 'Official Minecraft Discord server.',
    inviteUrl: 'https://discord.gg/minecraft',
    tags: ['Minecraft', 'Official'],
    imageUrl: '/servers/minecraft.webp',
    featured: false,
  },
  {
    name: 'Overwatch',
    description: 'Official, developer-run Overwatch Discord server.',
    inviteUrl: 'https://discord.com/invite/overwatch',
    tags: ['Overwatch', 'Official'],
    imageUrl: '/servers/overwatch.webp',
    featured: false,
  },
  {
    name: 'Rocket League',
    description: 'Official, developer-run Rocket League Discord server.',
    inviteUrl: 'https://discord.gg/rocketleague',
    tags: ['Rocket League', 'Official'],
    imageUrl: '/servers/rocket-league.webp',
    featured: false,
  },
  {
    name: 'Stardew Valley',
    description: 'Main Stardew Valley community server.',
    inviteUrl: 'https://discord.gg/stardewvalley',
    tags: ['Stardew Valley', 'Community'],
    imageUrl: '/servers/stardew-valley.webp',
    featured: false,
  },
  {
    name: 'Super Smash Bros. Ultimate',
    description: 'Main Super Smash Bros. Ultimate community server.',
    inviteUrl: 'https://discord.com/invite/ssbu',
    tags: ['Super Smash Bros.', 'Community'],
    imageUrl: '/servers/super-smash-bros-ultimate.webp',
    featured: false,
  },
  {
    name: 'VALORANT',
    description: 'Official VALORANT Discord server in collaboration with Riot Games.',
    inviteUrl: 'https://discord.gg/valorant',
    tags: ['Valorant', 'Official'],
    imageUrl: '/servers/valorant.webp',
    featured: false,
  },
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