import "dotenv/config";

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

type SeedAccount = {
  email: string;
  password?: string;
  role?: Role | "USER" | "ADMIN";
};

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
    tags: ["Fighting"],
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
    tags: ["Sandbox", "Adventure"],
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

const playerList = [
  {
    username: "ZeBass",
    email: "zebass@foo.com",
    imageUrl: "https://pbs.twimg.com/profile_images/1278566466082574336/-kjvFHAS_400x400.jpg",
    game: "Overwatch 2",
    rank: "Gold",
  },
  {
    username: "Mathedealer1",
    email: "mathedealer1@foo.com",
    imageUrl: "https://pbs.twimg.com/profile_images/1448767886147796992/ajwp5OkK_400x400.jpg",
    game: "Valorant",
    rank: "Platinum",
  },
  {
    username: "koldqt",
    email: "koldqt@foo.com",
    imageUrl: "https://pbs.twimg.com/profile_images/2041633459760963584/1D_5n0o3_400x400.jpg",
    game: "Valorant",
    rank: "Gold",
  },
  {
    username: "Tesidn",
    email: "tesidn@foo.com",
    imageUrl: "https://pbs.twimg.com/profile_images/1516725783863062531/BxrqeNqA_400x400.jpg",
    game: "Valorant",
    rank: "Silver",
  },
  {
    username: "bazingahi50",
    email: "bazingahi50@foo.com",
    imageUrl: "https://media.licdn.com/dms/image/v2/C4D03AQGmJwN3A7jqoQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1606074819411?e=2147483647&v=beta&t=m0J9ATpipaJ2iMhTTnj4nqCnL_qqvhKRsQ5hJHiXE08",
    game: "Valorant",
    rank: "Silver",
  },
  {
    username: "bullzye",
    email: "bullzye@foo.com",
    imageUrl: "https://i.pinimg.com/736x/31/33/12/313312899252ca116155d9c8e173a962.jpg",
    game: "Counter-Strike 2",
    rank: "Gold Nova",
  },
  {
    username: "Kai808",
    email: "kai808@foo.com",
    imageUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/483a37ac-58fd-4e2f-8dc3-2c68a0164112-profile_image-70x70.png",
    game: "Valorant",
    rank: "Gold",
  },
  {
    username: "NoahK",
    email: "noahk@foo.com",
    imageUrl: "https://manoa.hawaii.edu/studentsuccess/images/sac/members/Minh_Tien_Nguyen.jpg",
    game: "Apex Legends",
    rank: "Platinum",
  },
  {
    username: "MichealWouldGo",
    email: "michealwouldgo@foo.com",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWoaKx7sO70Cbaua3C9Xkw4n416CmF7Ov6kQ&s",
    game: "League of Legends",
    rank: "Silver",
  },
  {
    username: "Kaimana_X",
    email: "kaimana_x@foo.com",
    imageUrl: "https://manoa.hawaii.edu/studentsuccess/images/sac/members/Minh_Tien_Nguyen.jpg",
    game: "Rocket League",
    rank: "Diamond",
  },
  {
    username: "BraddahJay",
    email: "braddahjay@foo.com",
    imageUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/43c71a14-c368-4f41-9373-ccdb795f267f-profile_image-70x70.png",
    game: "Call of Duty: Warzone",
    rank: "Diamond",
  },
  {
    username: "KeoniFPS",
    email: "keonifps@foo.com",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAyTAG1Aw2F0eDaS6Ladv46l_ZqZUGTT2UXQ&s",
    game: "Counter-Strike 2",
    rank: "Master Guardian",
  },
  {
    username: "LaniPlays",
    email: "laniplays@foo.com",
    imageUrl: "https://i.pinimg.com/736x/99/d6/29/99d62935ef324ee164c74e43e41c1dd7.jpg",
    game: "Stardew Valley",
    rank: "Farmer",
  },
  {
    username: "TuaClutch",
    email: "tuaclutch@foo.com",
    imageUrl: "https://www.coastmagazine.co.uk/wp-content/uploads/sites/14/2021/11/1011336-2-credit_chris_moakes_0.jpg?w=900",
    game: "Valorant",
    rank: "Ascendant",
  },
  {
    username: "Nathaniel_SV",
    email: "nathaniel_sv@foo.com",
    imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQGezcj5xoe_zw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1720472540996?e=2147483647&v=beta&t=4BiZPyL2wJ3XSGZ1ItQwd_kCtx_VgoAvANn2e1TvYxE",
    game: "Halo Infinite",
    rank: "Onyx",
  },
  {
    username: "Rey808",
    email: "rey808@foo.com",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvNnWEhyrTK1XdLsDSaNz_NUlGEOL5SEv5dw&s",
    game: "Fortnite",
    rank: "Elite",
  },
  {
    username: "AidenHNL",
    email: "aidenhnl@foo.com",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUh8BTL5m20YVP86aG9cBbNELZCcGe-_z0YQ&s",
    game: "Rainbow Six Siege",
    rank: "Gold",
  },
  {
    username: "Zachary999",
    email: "zachary999@foo.com",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgGJWOBow8Ab7EgAAY7-Rkqvp0n8ZGhlD43w&s",
    game: "League of Legends",
    rank: "Platinum",
  },
  {
    username: "JayGG",
    email: "jaygg@foo.com",
    imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQGZYpKLnz_BCg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1706172615868?e=2147483647&v=beta&t=_2c1foEAfdr5wz-SqR_nu4H7xmMmPSeoVwWSPgPt6kc",
    game: "Dota 2",
    rank: "Archon",
  },
  {
    username: "Nalu",
    email: "nalu@foo.com",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiG3L80-kNfSylmgez_EcYIwxQ3BIu3rurqg&s",
    game: "Sea of Thieves",
    rank: "Pirate Legend",
  },
  {
    username: "MicahX",
    email: "micahx@foo.com",
    imageUrl: "https://c8.alamy.com/comp/HGFFE7/young-boys-seating-on-a-wall-off-waikiki-oahu-hawaii-a-favorate-local-HGFFE7.jpg",
    game: "Overwatch 2",
    rank: "Diamond",
  },
  {
    username: "Dre808",
    email: "dre808@foo.com",
    imageUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/8fcfd5ba-f545-45b3-8036-dae30381b950-profile_image-50x50.png",
    game: "PUBG: Battlegrounds",
    rank: "Ace",
  },
  {
    username: "Tasi",
    email: "tasi@foo.com",
    imageUrl: "https://asceuhm.weebly.com/uploads/3/7/4/1/37419027/asce-picture-trip-hiramoto_orig.jpeg",
    game: "SMITE",
    rank: "Diamond",
  },
  {
    username: "KoaFPS",
    email: "koafps@foo.com",
    imageUrl: "https://i.pinimg.com/1200x/d9/3c/39/d93c397e006815ec3f528e87ba846b4f.jpg",
    game: "Counter-Strike 2",
    rank: "Global Elite",
  },
  {
    username: "Zane",
    email: "zane@foo.com",
    imageUrl: "https://media.tenor.com/5O6RGXcwQnUAAAAM/the-last-of-us.gif",
    game: "Valorant",
    rank: "Immortal",
  },
  {
    username: "Leilani",
    email: "leilani@foo.com",
    imageUrl: "https://i.pinimg.com/736x/a3/29/9a/a3299a4ea4cb4c35e8abb2f3599f9843.jpg",
    game: "Genshin Impact",
    rank: "Adventure Rank 55",
  },
  {
    username: "Tyler808",
    email: "tyler808@foo.com",
    imageUrl: "https://preview.redd.it/wearing-a-flat-cap-backwards-v0-ancqx2gi4edb1.jpg?width=170&format=pjpg&auto=webp&s=1e132357b70421b98f08bf47d1278f67fc98fac1",
    game: "Rocket League",
    rank: "Champion",
  },
  {
    username: "Kekoa",
    email: "kekoa@foo.com",
    imageUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/53e6d242-7fc2-494e-9cc9-417fe7453a9e-profile_image-70x70.png",
    game: "Elden Ring",
    rank: "Tarnished",
  },
  {
    username: "BrandonHI",
    email: "brandonhi@foo.com",
    imageUrl: "https://asceuhm.weebly.com/uploads/3/7/4/1/37419027/img-8810-jordin-martos_orig.jpg",
    game: "Call of Duty: Warzone",
    rank: "Diamond",
  },
  {
    username: "Chris96819",
    email: "chris96819@foo.com",
    imageUrl: "https://asceuhm.weebly.com/uploads/3/7/4/1/37419027/screenshot-2025-08-30-at-12-15-43-am_orig.png",
    game: "Apex Legends",
    rank: "Platinum",
  },
  {
    username: "NoelX",
    email: "noelx@foo.com",
    imageUrl: "https://i.pinimg.com/1200x/75/97/6e/75976e1a43f645fb8ea19742d2c9f02f.jpg",
    game: "Fortnite",
    rank: "Champion",
  },
  {
    username: "AlikaBasco01",
    email: "alikabasco01@foo.com",
    imageUrl: "https://i5.walmartimages.com/seo/signs-4-fun-nmlid-mclovin-id-license-s-driver-s-license_2e3b56d7-a59f-4986-a3cf-eeb4c6ae3a57_1.e63fd4c1093d34258ccb9ceb14d24afc.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    game: "World of Warcraft",
    rank: "Heroic Raider",
  },
  {
    username: "Sean808",
    email: "sean808@foo.com",
    imageUrl: "/default-player.svg",
    game: "Rainbow Six Siege",
    rank: "Platinum",
  },
  {
    username: "Kawika",
    email: "kawika@foo.com",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDFWak9tc-VWN8ssI29mWCho8l7ydYIAlkQQ&s",
    game: "Monster Hunter",
    rank: "Hunter Rank 100",
  },
  {
    username: "EliHI",
    email: "elihi@foo.com",
    imageUrl: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-560w,f_auto,q_auto:best/newscms/2020_46/3426525/201106-adrian-tam-hawaii-se-1247p.jpg",
    game: "Minecraft",
    rank: "Builder",
  },
  {
    username: "JonahK",
    email: "jonahk@foo.com",
    imageUrl: "https://calflyfisher.com/wp-content/uploads/2025/12/Ng_Jon_Winter2026_Hawaii-1024x683.jpg",
    game: "Valorant",
    rank: "Radiant",
  },
];

const defaultProfiles: Record<
  string,
  {
    username: string | null;
    description: string;
    interests: string;
    profilePicture: string | null;
  }
> = {
  "admin@foo.com": {
    username: "admin",
    description: "UH GameLink admin account.",
    interests: "Gaming communities, moderation, site testing",
    profilePicture: null,
  },
  "john@foo.com": {
    username: "john",
    description: "Casual and competitive gamer looking for people to queue with.",
    interests: "Valorant, Apex Legends, League of Legends",
    profilePicture: null,
  },
  "jane@foo.com": {
    username: "jane",
    description: "Enjoys co-op games and meeting new players around campus.",
    interests: "Minecraft, Stardew Valley, Overwatch 2",
    profilePicture: null,
  },
};

const communityServers = [
  {
    name: "UH Esports",
    description: "Official University of Hawaiʻi esports community server.",
    inviteUrl: "https://discord.gg/uhesports",
    tags: ["UH", "Esports", "Campus", "Official", "Events"],
    imageUrl: "/servers/uh-esports.webp",
    featured: true,
  },
  {
    name: "Women of UH Esports",
    description: "Women of UH Esports community server.",
    inviteUrl: "https://discord.gg/jPRujZtnmz",
    tags: ["UH", "Esports", "Community", "Campus", "Official"],
    imageUrl: "/servers/wouhe.webp",
    featured: true,
  },
  {
    name: "Manoa Academy of Gamers",
    description:
      "The goal of MAG is to provide a safe and comfortable space for people to play games, as well as make connections and acknowledge that gaming and college life can be mutually beneficial to students’ success in assimilating into college life at UHM.",
    inviteUrl: "https://discord.gg/jHrrdW4dnN",
    tags: ["UH", "Esports", "Community", "Campus", "Student Organization"],
    imageUrl: "/servers/manoa-academy-of-gamers.webp",
    featured: true,
  },
  {
    name: "Apex Legends",
    description: "Official community-run, developer-supported Apex Legends server.",
    inviteUrl: "https://discord.gg/apexlegends",
    tags: ["Apex Legends", "Official"],
    imageUrl: "/servers/apex-legends.webp",
    featured: false,
  },
  {
    name: "Counter-Strike Discord | CSGO & CS2",
    description: "Official Counter-Strike Discord server for news, updates, and LFG.",
    inviteUrl: "https://discord.gg/counterstrike",
    tags: ["Counter-Strike", "Official"],
    imageUrl: "/servers/cs2.webp",
    featured: false,
  },
  {
    name: "Official Fortnite",
    description: "Official Fortnite Discord server for news, updates, and LFG.",
    inviteUrl: "https://discord.gg/fortnite",
    tags: ["Fortnite", "Official"],
    imageUrl: "/servers/fortnite.webp",
    featured: false,
  },
  {
    name: "Genshin Impact Official",
    description: "Official Genshin Impact Discord server.",
    inviteUrl: "https://discord.gg/genshinimpact",
    tags: ["Genshin Impact", "Official"],
    imageUrl: "/servers/genshin-impact.webp",
    featured: false,
  },
  {
    name: "League of Legends",
    description: "Official League of Legends Discord server run in collaboration with Riot Games.",
    inviteUrl: "https://discord.gg/leagueoflegends",
    tags: ["League of Legends", "Official"],
    imageUrl: "/servers/league-of-legends.webp",
    featured: false,
  },
  {
    name: "MINECRAFT",
    description: "Official Minecraft Discord server.",
    inviteUrl: "https://discord.gg/minecraft",
    tags: ["Minecraft", "Official"],
    imageUrl: "/servers/minecraft.webp",
    featured: false,
  },
  {
    name: "Overwatch",
    description: "Official, developer-run Overwatch Discord server.",
    inviteUrl: "https://discord.com/invite/overwatch",
    tags: ["Overwatch", "Official"],
    imageUrl: "/servers/overwatch.webp",
    featured: false,
  },
  {
    name: "Rocket League",
    description: "Official, developer-run Rocket League Discord server.",
    inviteUrl: "https://discord.gg/rocketleague",
    tags: ["Rocket League", "Official"],
    imageUrl: "/servers/rocket-league.webp",
    featured: false,
  },
  {
    name: "Stardew Valley",
    description: "Main Stardew Valley community server.",
    inviteUrl: "https://discord.gg/stardewvalley",
    tags: ["Stardew Valley", "Community"],
    imageUrl: "/servers/stardew-valley.webp",
    featured: false,
  },
  {
    name: "Super Smash Bros. Ultimate",
    description: "Main Super Smash Bros. Ultimate community server.",
    inviteUrl: "https://discord.com/invite/ssbu",
    tags: ["Super Smash Bros.", "Community"],
    imageUrl: "/servers/super-smash-bros-ultimate.webp",
    featured: false,
  },
  {
    name: "VALORANT",
    description: "Official VALORANT Discord server in collaboration with Riot Games.",
    inviteUrl: "https://discord.gg/valorant",
    tags: ["Valorant", "Official"],
    imageUrl: "/servers/valorant.webp",
    featured: false,
  },
];

const getUniqueAccounts = () => {
  const accountsByEmail = new Map<string, SeedAccount>();

  const configAccounts = config.defaultAccounts as SeedAccount[];

  configAccounts.forEach((account) => {
    accountsByEmail.set(account.email, {
      email: account.email,
      password: account.password ?? "changeme",
      role: account.role ?? Role.USER,
    });
  });

  playerList.forEach((player) => {
    if (!accountsByEmail.has(player.email)) {
      accountsByEmail.set(player.email, {
        email: player.email,
        password: "changeme",
        role: Role.USER,
      });
    }
  });

  return Array.from(accountsByEmail.values());
};

const getProfileSeed = (account: SeedAccount) => {
  const matchingPlayer = playerList.find((player) => player.email === account.email);

  if (matchingPlayer) {
    return {
      username: matchingPlayer.username,
      description: `Hi, I'm ${matchingPlayer.username} and I'm looking for other UH GameLink users to play with.`,
      interests: `${matchingPlayer.game}, gaming, meeting new players`,
      profilePicture: matchingPlayer.imageUrl,
    };
  }

  return (
    defaultProfiles[account.email] ?? {
      username: account.email.split("@")[0],
      description: `Hi, I'm ${account.email.split("@")[0]} and I'm looking for other UH GameLink users to play with.`,
      interests: "Gaming, meeting new people, campus community",
      profilePicture: "/default-profile.png",
    }
  );
};

async function main() {
  console.log("Seeding the database");

  const accounts = getUniqueAccounts();

  for (const account of accounts) {
    const role = account.role === "ADMIN" ? Role.ADMIN : Role.USER;
    const password = await hash(account.password ?? "changeme", 10);

    console.log(`  Creating/updating user: ${account.email} with role: ${role}`);

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

    const profileSeed = getProfileSeed(account);

    console.log(`  Creating/updating profile for: ${account.email}`);

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        username: profileSeed.username,
        description: profileSeed.description,
        interests: profileSeed.interests,
        profilePicture: profileSeed.profilePicture,
      },
      create: {
        username: profileSeed.username,
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
    console.log(`  Adding player listing: ${player.username}`);

    const user = await prisma.user.findUnique({
      where: { email: player.email },
    });

    if (!user) {
      throw new Error(`Missing seeded user for player listing: ${player.username}`);
    }

    await prisma.player.upsert({
      where: {
        userId_game: {
          userId: user.id,
          game: player.game,
        },
      },
      update: {
        username: player.username,
        imageUrl: player.imageUrl,
        rank: player.rank,
      },
      create: {
        username: player.username,
        imageUrl: player.imageUrl,
        game: player.game,
        rank: player.rank,
        userId: user.id,
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

  console.log("Database seeding complete");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });