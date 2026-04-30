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
    imageUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/483a37ac-58fd-4e2f-8dc3-2c68a0164112-profile_image-70x70.png",
    game: "Valorant",
    rank: "Gold",
  },
  {
    username: "NoahK",
    imageUrl: "https://manoa.hawaii.edu/studentsuccess/images/sac/members/Minh_Tien_Nguyen.jpg",
    game: "Apex Legends",
    rank: "Platinum",
  },
  {
    username: "MichealWouldGo",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWoaKx7sO70Cbaua3C9Xkw4n416CmF7Ov6kQ&s",
    game: "League of Legends",
    rank: "Silver",
  },
  {
    username: "Kaimana_X",
    imageUrl: "https://manoa.hawaii.edu/studentsuccess/images/sac/members/Minh_Tien_Nguyen.jpg",
    game: "Rocket League",
    rank: "Diamond",
  },
  {
    username: "BraddahJay",
    imageUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/43c71a14-c368-4f41-9373-ccdb795f267f-profile_image-70x70.png",
    game: "Call of Duty: Warzone",
    rank: "Diamond",
  },
  {
    username: "KeoniFPS",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAyTAG1Aw2F0eDaS6Ladv46l_ZqZUGTT2UXQ&s",
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
    imageUrl: "https://www.coastmagazine.co.uk/wp-content/uploads/sites/14/2021/11/1011336-2-credit_chris_moakes_0.jpg?w=900",
    game: "Valorant",
    rank: "Ascendant",
  },
  {
    username: "Nathaniel_SV",
    imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQGezcj5xoe_zw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1720472540996?e=2147483647&v=beta&t=4BiZPyL2wJ3XSGZ1ItQwd_kCtx_VgoAvANn2e1TvYxE",
    game: "Halo Infinite",
    rank: "Onyx",
  },
  {
    username: "Rey808",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvNnWEhyrTK1XdLsDSaNz_NUlGEOL5SEv5dw&s",
    game: "Fortnite",
    rank: "Elite",
  },

  {
    username: "AidenHNL",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUh8BTL5m20YVP86aG9cBbNELZCcGe-_z0YQ&s",
    game: "Rainbow Six Siege",
    rank: "Gold",
  },
  {
    username: "Zachary999",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgGJWOBow8Ab7EgAAY7-Rkqvp0n8ZGhlD43w&s",
    game: "League of Legends",
    rank: "Platinum",
  },
  {
    username: "JayGG",
    imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQGZYpKLnz_BCg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1706172615868?e=2147483647&v=beta&t=_2c1foEAfdr5wz-SqR_nu4H7xmMmPSeoVwWSPgPt6kc",
    game: "Dota 2",
    rank: "Archon",
  },
  {
    username: "Nalu",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiG3L80-kNfSylmgez_EcYIwxQ3BIu3rurqg&s",
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
    imageUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/8fcfd5ba-f545-45b3-8036-dae30381b950-profile_image-50x50.png",
    game: "PUBG: Battlegrounds",
    rank: "Ace",
  },
  {
    username: "Tasi",
    imageUrl: "https://asceuhm.weebly.com/uploads/3/7/4/1/37419027/asce-picture-trip-hiramoto_orig.jpeg",
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
    imageUrl: "https://media.tenor.com/5O6RGXcwQnUAAAAM/the-last-of-us.gif",
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
    imageUrl: "https://preview.redd.it/wearing-a-flat-cap-backwards-v0-ancqx2gi4edb1.jpg?width=170&format=pjpg&auto=webp&s=1e132357b70421b98f08bf47d1278f67fc98fac1",
    game: "Rocket League",
    rank: "Champion",
  },
  {
    username: "Kekoa",
    imageUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/53e6d242-7fc2-494e-9cc9-417fe7453a9e-profile_image-70x70.png",
    game: "Elden Ring",
    rank: "Tarnished",
  },
  {
    username: "BrandonHI",
    imageUrl: "https://asceuhm.weebly.com/uploads/3/7/4/1/37419027/img-8810-jordin-martos_orig.jpg",
    game: "Call of Duty: Warzone",
    rank: "Diamond",
  },
  {
    username: "Chris96819",
    imageUrl: "https://asceuhm.weebly.com/uploads/3/7/4/1/37419027/screenshot-2025-08-30-at-12-15-43-am_orig.png",
    game: "Apex Legends",
    rank: "Platinum",
  },
  {
    username: "NoelX",
    imageUrl: "https://i.pinimg.com/1200x/75/97/6e/75976e1a43f645fb8ea19742d2c9f02f.jpg",
    game: "Fortnite",
    rank: "Champion",
  },
  {
    username: "AlikaBasco01",
    imageUrl: "https://i5.walmartimages.com/seo/signs-4-fun-nmlid-mclovin-id-license-s-driver-s-license_2e3b56d7-a59f-4986-a3cf-eeb4c6ae3a57_1.e63fd4c1093d34258ccb9ceb14d24afc.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    game: "World of Warcraft",
    rank: "Heroic Raider",
  },
  {
    username: "Sean808",
    imageUrl: "data:image/jpeg;base64,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",
    game: "Rainbow Six Siege",
    rank: "Platinum",
  },
  {
    username: "Kawika",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDFWak9tc-VWN8ssI29mWCho8l7ydYIAlkQQ&s",
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