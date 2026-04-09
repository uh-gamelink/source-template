import { Container } from 'react-bootstrap';

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
    </Container>
  </main>
);

export default Home;