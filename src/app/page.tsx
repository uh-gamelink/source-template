import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

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

const scrollingGames = [...games, ...games];

const Home = () => (
  <main>
    <Container className="py-1 mt-5">
      <h1>
        Welcome to
        <br />
        UH GameLink
      </h1>

      <div className="shortline pb-4">____________________________</div>

      <p>
        UH GameLink is a web application designed to help University of Hawai&apos;i students
        connect with other students through video games. Many students play games casually or
        competitively, but it can be difficult to find other UH students with similar interests,
        schedules, or favorite games. This project aims to make it easier for students to meet new
        people, discover gaming communities, and build connections through shared games.
      </p>

      <p>
        Explore the site&apos;s library, find players, and connect with the community!
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
      <Container>
        <Row className="mb-2 mt-4">
          <Col className="text-center">
            <h3>Directory</h3>
            <div className="shortline pb-4">____________________________</div>
          </Col>
        </Row>
        <Row className="g-5 pb-5 pt-1 mx-5">
          <Col md={4}>
            <Card className="h-100 shadow-sm custom-card-body p-3 text-center">
              <p>
                Visit our community page to see UH's Discord game servers.
              </p>
              <a
                href="/community"
                className="btn custom-tag-btn border-0 w-50 mx-auto d-block"
              >
                Connect
              </a>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm custom-card-body p-3 text-center">
              <p>
                Learn more about the developers behind UH GameLink.
              </p>
              <a
                href="/about"
                className="btn custom-tag-btn border-0 w-50 mx-auto d-block"
              >
                Visit
              </a>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm custom-card-body p-3 text-center">
              <p>
                Join the UH gaming community and connect with other players.
              </p>
              <a
                href="/auth/signin"
                className="btn custom-tag-btn border-0 w-50 mx-auto d-block"
              >
                Join
              </a>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  </main>
);

export default Home;