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
        UH GameLink helps University of Hawaiʻi students connect through video games.
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
        <Row className="g-5 my-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm custom-card-body p-3">
              <p>
                Visit our community page to explore Discord game servers on campus.
              </p>
              <a href="/community" className="btn custom-tag-btn border-0 w-100">
                Connect
              </a>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm custom-card-body p-3">
              <p>
                Learn more about the developers behind UH GameLink.
              </p>
              <a href="/about" className="btn custom-tag-btn border-0 w-100">
                Visit
              </a>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm custom-card-body p-3">
              <p>
                Join the UH gaming community and connect with other players.
              </p>
              <a href="/auth/signin" className="btn custom-tag-btn border-0 w-100">
                Sign Up
              </a>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  </main>
);

export default Home;