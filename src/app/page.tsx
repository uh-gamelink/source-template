'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { redirect } from 'next/navigation';

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

const Home = () => {
  const { data: session, status } = useSession();

  if (session?.user.role === 'ADMIN') {
    redirect('/admin/manage');
  }
  
  const communityHref = session ? '/community' : '/auth/signin';
  const communityLabel = session ? 'Find' : 'Join';
  const libraryHref = session ? '/gamelibrary' : '/auth/signin';
  const LibraryLabel = session ? 'View' : 'Sign up';
  const findPlayersHref = session ? '/findplayers' : '/auth/signin';
  const findPlayersLabel = session ? 'Search' : 'Sign in';

  return (
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

        <div>
          <Row className="mb-2 mt-4">
            <Col className="text-center">
              <h3>Directory</h3>
              <div className="shortline pb-4">____________________________</div>
            </Col>
          </Row>

          <Row className="g-4 pb-5 pt-1 justify-content-center">
            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm custom-card-body px-3 py-5 text-center d-flex flex-column">
                <p>
                  See our game library to view available games and add favorites.
                </p>

                <a
                  href={libraryHref}
                  className="btn custom-home-btn border-0 w-50 mx-auto mt-auto"
                >
                  {status === 'loading' ? 'Loading...' : LibraryLabel}
                </a>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm custom-card-body px-3 py-5 text-center d-flex flex-column">
                <p>
                  Visit our community page to see UH&apos;s Discord game servers.
                </p>

                <a
                  href={communityHref}
                  className="btn custom-home-btn border-0 w-50 mx-auto mt-auto"
                >
                  {status === 'loading' ? 'Loading...' : communityLabel}
                </a>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm custom-card-body px-3 py-5 text-center d-flex flex-column">
                <p>
                  Learn more about the developers behind UH GameLink.
                </p>

                <a
                  href="/about"
                  className="btn custom-home-btn border-0 w-50 mx-auto mt-auto"
                >
                  Visit
                </a>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm custom-card-body px-3 py-5 text-center d-flex flex-column">
                <p>
                  Search for and connect with other players.
                </p>

                <a
                  href={findPlayersHref}
                  className="btn custom-home-btn border-0 w-50 mx-auto mt-auto"
                >
                  {status === 'loading' ? 'Loading...' : findPlayersLabel}
                </a>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm custom-card-body px-3 py-5 text-center d-flex flex-column">
                <p>
                  See other users&apos; experiences and feedback about UH GameLink.
                </p>

                <a
                  href="/reviews"
                  className="btn custom-home-btn border-0 w-50 mx-auto mt-auto"
                >
                  View
                </a>
              </Card>
            </Col>
            {session && (
              
            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm custom-card-body px-3 py-5 text-center d-flex flex-column">
                <p>
                  Help us foster a supportive gaming community on campus, reports of harrassment or miscoduct.
                </p>

                <a
                  href="/reviews"
                  className="btn custom-home-btn border-0 w-50 mx-auto mt-auto"
                >
                  Report
                </a>
              </Card>
            </Col>
            )}
          </Row>
        </div>
        <Row className="mt-5 mb-5">
          <Col className="text-center">
            <Card className="custom-card-body px-4 py-5 shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
              <h4>Need Help?</h4>
              <p className="mt-0 transparent-line">_______</p>
              <p className="mb-2">
                For player-related issues, see our
                 Report Player page.
              </p>
              <p className="mb-2">
                For any concerns or technical issues, please contact our 
              </p>
              <p>
              administrator by email at: 📧 <strong>admin@uhgamelink.com</strong>
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Home;