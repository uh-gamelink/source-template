import "dotenv/config";

import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcrypt";
import * as config from "../config/settings.development.json";
import games from "./data/games.json";
import communityServers from "./data/communityServers.json";

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

  await Promise.all(
    games.map((game) => {
      console.log(`  Adding game: ${game.title}`);

      return prisma.game.upsert({
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
    }),
  );

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

  await Promise.all(
    communityServers.map((server) => {
      console.log(`  Adding community server: ${server.name}`);

      return prisma.communityServer.upsert({
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
    }),
  );

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