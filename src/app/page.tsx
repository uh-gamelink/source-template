import Image from 'next/image';
import { Container } from 'react-bootstrap';

const games = [
  '/games/apex-legends.jpg',
  '/games/counter-strike-2.png',
  '/games/fortnite.png',
  '/games/genshin-impact.png',
  '/games/league-of-legends.png',
  '/games/minecraft.png',
  '/games/overwatch-2.jpg',
  '/games/rocket-league.png',
  '/games/stardew-valley.png',
  '/games/super-smash-bros.png',
  '/games/valorant.png',
];

// duplicate the list so the scroll loops more smoothly
const scrollingGames = [...games, ...games];

const Home = () => (
  <main>
    <Container className="py-3">
      <h1>
        Welcome to UH
        <br />
        GameLink
      </h1>

      <p>
        UH GameLink is a web application designed to help University of Hawai&apos;i students
        connect with other students through video games. Many students play games casually or
        competitively, but it can be difficult to find other UH students with similar interests,
        schedules, or favorite games. This project aims to make it easier for students to meet new
        people, discover gaming communities, and build connections through shared games.
      </p>

      <p>
        Feel free to explore the site&apos;s library, find other players, and link up with
        community!
      </p>

      <div className="game-belt">
        <div className="game-track">
          {scrollingGames.map((src, index) => (
            <div className="game-item" key={`${src}-${index}`}>
              <Image
                src={src}
                alt={`Game cover ${index + 1}`}
                width={180}
                height={240}
                className="game-image"
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  </main>
);

export default Home;