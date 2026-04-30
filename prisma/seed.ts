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
    tags: ["Battle Royale", "FPS", "Competitive"],
    description: "A squad-based battle royale shooter with unique character abilities.",
    imageUrl: "/gamesLib/apex-legends.webp",
  },
  {
    title: "Counter-Strike 2",
    developer: "Valve",
    platform: "PC",
    tags: ["FPS", "Competitive"],
    description: "A competitive tactical first-person shooter focused on team-based objective play.",
    imageUrl: "/gamesLib/counter-strike-2.png",
  },
  {
    title: "Fortnite",
    developer: "Epic Games",
    platform: "PC / PlayStation / Xbox / Switch / Mobile",
    tags: ["Battle Royale", "Competitive"],
    description: "A fast-paced battle royale game known for building mechanics and live events.",
    imageUrl: "/gamesLib/fortnite.png",
  },
  {
    title: "Genshin Impact",
    developer: "miHoYo",
    platform: "PC / PlayStation / Mobile",
    tags: ["RPG", "Adventure", "Co-op"],
    description: "An open-world action RPG centered on exploration, elemental combat, and story quests.",
    imageUrl: "/gamesLib/genshin-impact.png",
  },
  {
    title: "League of Legends",
    developer: "Riot Games",
    platform: "PC",
    tags: ["MOBA", "Competitive"],
    description: "A competitive multiplayer online battle arena game with a large roster of champions.",
    imageUrl: "/gamesLib/league-of-legends.png",
  },
  {
    title: "Minecraft",
    developer: "Mojang Studios",
    platform: "Multi-platform",
    tags: ["Sandbox", "Survival", "Adventure"],
    description: "A sandbox game built around exploration, crafting, building, and survival.",
    imageUrl: "/gamesLib/minecraft.jpg",
  },
  {
    title: "Overwatch 2",
    developer: "Blizzard Entertainment",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["FPS", "Competitive"],
    description: "A team-based hero shooter focused on objective play and character abilities.",
    imageUrl: "/gamesLib/overwatch-2.png",
  },
  {
    title: "Rocket League",
    developer: "Psyonix",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["Sports", "Competitive"],
    description: "A high-speed competitive game that mixes soccer with rocket-powered cars.",
    imageUrl: "/gamesLib/rocket-league.png",
  },
  {
    title: "Stardew Valley",
    developer: "ConcernedApe",
    platform: "PC / PlayStation / Xbox / Switch / Mobile",
    tags: ["RPG", "Sandbox", "Co-op"],
    description: "A farming and life simulation game focused on building a farm and connecting with a town.",
    imageUrl: "/gamesLib/stardew-valley.png",
  },
  {
    title: "Super Smash Bros. Ultimate",
    developer: "Bandai Namco Studios / Sora Ltd.",
    platform: "Nintendo Switch",
    tags: ["Fighting", "Party"],
    description: "A crossover platform fighting game featuring characters from many major franchises.",
    imageUrl: "/gamesLib/super-smash-bros.png",
  },
  {
    title: "Valorant",
    developer: "Riot Games",
    platform: "PC",
    tags: ["FPS", "Competitive"],
    description: "A 5v5 tactical hero shooter built around precise gunplay and agent abilities.",
    imageUrl: "/gamesLib/valorant.webp",
  },
  {
    title: "Among Us",
    developer: "Innersloth",
    platform: "PC / PlayStation / Xbox / Switch / Mobile",
    tags: ["Party"],
    description: "A social deduction game where crewmates complete tasks while impostors try to eliminate them.",
    imageUrl: "/gamesLib/among-us.png",
  },
  {
    title: "ARK: Survival Evolved",
    developer: "Studio Wildcard",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["Survival", "Adventure"],
    description: "A survival game where players tame dinosaurs, build bases, and explore dangerous prehistoric worlds.",
    imageUrl: "/gamesLib/ark.avif",
  },
  {
    title: "Baldur's Gate 3",
    developer: "Larian Studios",
    platform: "PC / PlayStation / Xbox",
    tags: ["RPG", "Adventure", "Co-op"],
    description: "A story-driven fantasy RPG with turn-based combat, character choices, and cooperative party play.",
    imageUrl: "/gamesLib/baldurs-gate.avif",
  },
  {
    title: "Battlefield 6",
    developer: "DICE",
    platform: "PC / PlayStation / Xbox",
    tags: ["FPS"],
    description: "A first-person shooter series known for large maps, vehicles, squads, and objective-based combat.",
    imageUrl: "/gamesLib/battlefield.jpeg",
  },
  {
    title: "The Binding of Isaac",
    developer: "Edmund McMillen",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["RPG", "Roguelike", "Co-op"],
    description: "A dark roguelike dungeon crawler with randomized rooms, items, enemies, and chaotic co-op gameplay.",
    imageUrl: "/gamesLib/binding-of-isaac.avif",
  },
  {
    title: "Brawlhalla",
    developer: "Blue Mammoth Games",
    platform: "PC / PlayStation / Xbox / Switch / Mobile",
    tags: ["Fighting"],
    description: "A free-to-play platform fighting game where players battle using weapons, movement, and stage control.",
    imageUrl: "/gamesLib/brawlhalla.png",
  },
  {
    title: "Dead by Daylight",
    developer: "Behaviour Interactive",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["Horror"],
    description: "An asymmetrical horror game where survivors work together to escape while one killer hunts them down.",
    imageUrl: "/gamesLib/dead-by-daylight.png",
  },
  {
    title: "Divinity: Original Sin 2",
    developer: "Larian Studios",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["RPG", "Adventure"],
    description: "A fantasy RPG with deep character builds, turn-based combat, and cooperative story progression.",
    imageUrl: "/gamesLib/divinity-2.webp",
  },
  {
    title: "Dota 2",
    developer: "Valve",
    platform: "PC",
    tags: ["MOBA", "Competitive"],
    description: "A competitive MOBA where two teams battle to destroy the enemy Ancient using heroes with unique abilities.",
    imageUrl: "/gamesLib/dota-2.jpg",
  },
  {
    title: "Elden Ring",
    developer: "FromSoftware",
    platform: "PC / PlayStation / Xbox",
    tags: ["RPG", "Adventure"],
    description: "An open-world action RPG with challenging combat, exploration, boss fights, and online cooperative play.",
    imageUrl: "/gamesLib/elden-ring.webp",
  },
  {
    title: "Escape from Tarkov",
    developer: "Battlestate Games",
    platform: "PC",
    tags: ["FPS", "Survival", "Competitive"],
    description: "A hardcore extraction shooter focused on survival, looting, tactical combat, and high-risk raids.",
    imageUrl: "/gamesLib/escape-from-tarkov.jpg",
  },
  {
    title: "Fall Guys",
    developer: "Mediatonic",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["Party"],
    description: "A chaotic party platformer where players race through obstacle courses and elimination-style minigames.",
    imageUrl: "/gamesLib/fall-guys.png",
  },
  {
    title: "EA Sports FC 26",
    developer: "EA Sports",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["Sports"],
    description: "A soccer simulation game focused on team building, online matches, and competitive football gameplay.",
    imageUrl: "/gamesLib/fc-26.webp",
  },
  {
    title: "Final Fantasy XIV",
    developer: "Square Enix",
    platform: "PC / PlayStation / Xbox",
    tags: ["RPG", "Co-op"],
    description: "A fantasy MMORPG with story quests, dungeons, raids, crafting, and large-scale online adventures.",
    imageUrl: "/gamesLib/final-fantasy.png",
  },
  {
    title: "Forza",
    developer: "Turn 10 Studios",
    platform: "PC / Xbox",
    tags: ["Racing", "Adventure"],
    description: "A racing series featuring realistic driving, customizable cars, and competitive online races.",
    imageUrl: "/gamesLib/forza.png",
  },
  {
    title: "Halo Infinite",
    developer: "343 Industries",
    platform: "PC / Xbox",
    tags: ["FPS"],
    description: "A sci-fi first-person shooter with arena combat, ranked matches, and cooperative campaign options.",
    imageUrl: "/gamesLib/halo-infinite.png",
  },
  {
    title: "Monster Hunter",
    developer: "Capcom",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["RPG", "Adventure", "Co-op"],
    description: "An action RPG series where players hunt massive monsters, craft gear, and team up for challenging quests.",
    imageUrl: "/gamesLib/monster-hunter.png",
  },
  {
    title: "MultiVersus",
    developer: "Player First Games",
    platform: "PC / PlayStation / Xbox",
    tags: ["Fighting",],
    description: "A platform fighting game featuring team-based battles with characters from different Warner Bros. properties.",
    imageUrl: "/gamesLib/multiversus.avif",
  },
  {
    title: "Paladins",
    developer: "Evil Mojo Games",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["FPS", "Competitive"],
    description: "A team-based hero shooter with customizable champions, abilities, and objective-focused matches.",
    imageUrl: "/gamesLib/paladins.png",
  },
  {
    title: "Phasmophobia",
    developer: "Kinetic Games",
    platform: "PC / PlayStation / Xbox",
    tags: ["Horror", "Co-op"],
    description: "A cooperative horror game where players investigate haunted locations and identify different types of ghosts.",
    imageUrl: "/gamesLib/phasmophobia.jpg",
  },
  {
    title: "PUBG: Battlegrounds",
    developer: "KRAFTON",
    platform: "PC / PlayStation / Xbox / Mobile",
    tags: ["Battle Royale", "Competitive"],
    description: "A battle royale shooter where players loot, survive, and fight to be the last team standing.",
    imageUrl: "/gamesLib/pubg.jpg",
  },
  {
    title: "Rainbow Six Siege",
    developer: "Ubisoft Montreal",
    platform: "PC / PlayStation / Xbox",
    tags: ["FPS", "Competitive"],
    description: "A tactical first-person shooter focused on operators, destructible environments, and team-based strategy.",
    imageUrl: "/gamesLib/rainbow-6.jpg",
  },
  {
    title: "Risk of Rain 2",
    developer: "Hopoo Games",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["RPG", "Roguelike"],
    description: "A roguelike third-person shooter where players fight waves of enemies, collect items, and survive escalating difficulty.",
    imageUrl: "/gamesLib/risk-of-rain-2.png",
  },
  {
    title: "Rust",
    developer: "Facepunch Studios",
    platform: "PC / PlayStation / Xbox",
    tags: ["Survival", "FPS"],
    description: "A harsh survival game where players gather resources, build bases, raid enemies, and fight to stay alive.",
    imageUrl: "/gamesLib/rust.png",
  },
  {
    title: "Sea of Thieves",
    developer: "Rare",
    platform: "PC / Xbox / PlayStation",
    tags: ["RPG", "Adventure", "Co-op"],
    description: "A pirate adventure game where crews sail ships, hunt treasure, battle enemies, and explore the open sea.",
    imageUrl: "/gamesLib/sea-of-thieves.jpg",
  },
  {
    title: "SMITE",
    developer: "Titan Forge Games",
    platform: "PC / PlayStation / Xbox / Switch",
    tags: ["MOBA", "Competitive"],
    description: "A third-person MOBA where players control gods and mythological figures in team-based arena combat.",
    imageUrl: "/gamesLib/smite.png",
  },
  {
    title: "Terraria",
    developer: "Re-Logic",
    platform: "PC / PlayStation / Xbox / Switch / Mobile",
    tags: ["Sandbox","Adventure"],
    description: "A 2D sandbox adventure game focused on building, crafting, exploration, bosses, and cooperative survival.",
    imageUrl: "/gamesLib/terraria.webp",
  },
  {
    title: "Team Fortress 2",
    developer: "Valve",
    platform: "PC",
    tags: ["FPS", "Competitive"],
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
    tags: ["RPG", "Competitive", "Co-op"],
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
    profilePicture: null,
  },
  "john@foo.com": {
    description: "Casual and competitive gamer looking for people to queue with.",
    interests: "Valorant, Apex Legends, League of Legends",
    profilePicture: null,
  },
  "jane@foo.com": {
    description: "Enjoys co-op games and meeting new players around campus.",
    interests: "Minecraft, Stardew Valley, Overwatch 2",
    profilePicture: null,
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

  {
    username: "Kai808",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt6wnkd3DI5Id_yxyWdohPpgZVJeFhxRKy6A&s",
    game: "Valorant",
    rank: "Gold",
  },
  {
    username: "NoahK",
    imageUrl: "",
    game: "Apex Legends",
    rank: "Platinum",
  },
  {
    username: "Makoa",
    imageUrl: "",
    game: "League of Legends",
    rank: "Silver",
  },
  {
    username: "KaimanaX",
    imageUrl: "",
    game: "Rocket League",
    rank: "Diamond",
  },
  {
    username: "BraddahJay",
    imageUrl: "",
    game: "Call of Duty: Warzone",
    rank: "Diamond",
  },
  {
    username: "KeoniFPS",
    imageUrl: "",
    game: "Counter-Strike 2",
    rank: "Master Guardian",
  },
  {
    username: "LaniPlays",
    imageUrl: "https://i.pinimg.com/736x/99/d6/29/99d62935ef324ee164c74e43e41c1dd7.jpg",
    game: "Stardew Valley",
    rank: "Farmer",
  },
  {
    username: "TuaClutch",
    imageUrl: "",
    game: "Valorant",
    rank: "Ascendant",
  },
  {
    username: "Ikaika",
    imageUrl: "",
    game: "Halo Infinite",
    rank: "Onyx",
  },
  {
    username: "Rey808",
    imageUrl: "",
    game: "Fortnite",
    rank: "Elite",
  },

  {
    username: "AidenHNL",
    imageUrl: "",
    game: "Rainbow Six Siege",
    rank: "Gold",
  },
  {
    username: "JordanKai",
    imageUrl: "",
    game: "League of Legends",
    rank: "Platinum",
  },
  {
    username: "KimoGG",
    imageUrl: "",
    game: "Dota 2",
    rank: "Archon",
  },
  {
    username: "Nalu",
    imageUrl: "",
    game: "Sea of Thieves",
    rank: "Pirate Legend",
  },
  {
    username: "MicahX",
    imageUrl: "https://c8.alamy.com/comp/HGFFE7/young-boys-seating-on-a-wall-off-waikiki-oahu-hawaii-a-favorate-local-HGFFE7.jpg",
    game: "Overwatch 2",
    rank: "Diamond",
  },
  {
    username: "Dre808",
    imageUrl: "",
    game: "PUBG: Battlegrounds",
    rank: "Ace",
  },
  {
    username: "Tasi",
    imageUrl: "",
    game: "SMITE",
    rank: "Diamond",
  },
  {
    username: "KoaFPS",
    imageUrl: "https://i.pinimg.com/1200x/d9/3c/39/d93c397e006815ec3f528e87ba846b4f.jpg",
    game: "Counter-Strike 2",
    rank: "Global Elite",
  },
  {
    username: "Zane",
    imageUrl: "https://www.pinterest.com/pin/653162752251911138/",
    game: "Valorant",
    rank: "Immortal",
  },
  {
    username: "Leilani",
    imageUrl: "https://i.pinimg.com/736x/a3/29/9a/a3299a4ea4cb4c35e8abb2f3599f9843.jpg",
    game: "Genshin Impact",
    rank: "Adventure Rank 55",
  },

  {
    username: "Tyler808",
    imageUrl: "https://www.pinterest.com/pin/653162752251731470/",
    game: "Rocket League",
    rank: "Champion",
  },
  {
    username: "Kekoa",
    imageUrl: "data:image/jpeg;base64,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",
    game: "Elden Ring",
    rank: "Tarnished",
  },
  {
    username: "BrandonHI",
    imageUrl: "",
    game: "Call of Duty: Warzone",
    rank: "Diamond",
  },
  {
    username: "Isaiah",
    imageUrl: "",
    game: "Apex Legends",
    rank: "Platinum",
  },
  {
    username: "NoelX",
    imageUrl: "",
    game: "Fortnite",
    rank: "Champion",
  },
  {
    username: "Alika",
    imageUrl: "",
    game: "World of Warcraft",
    rank: "Heroic Raider",
  },
  {
    username: "Sean808",
    imageUrl: "",
    game: "Rainbow Six Siege",
    rank: "Platinum",
  },
  {
    username: "Kawika",
    imageUrl: "",
    game: "Monster Hunter",
    rank: "Hunter Rank 100",
  },
  {
    username: "EliHI",
    imageUrl: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-560w,f_auto,q_auto:best/newscms/2020_46/3426525/201106-adrian-tam-hawaii-se-1247p.jpg",
    game: "Minecraft",
    rank: "Builder",
  },
  {
    username: "JonahK",
    imageUrl: "https://calflyfisher.com/wp-content/uploads/2025/12/Ng_Jon_Winter2026_Hawaii-1024x683.jpg",
    game: "Valorant",
    rank: "Radiant",
  },
]


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