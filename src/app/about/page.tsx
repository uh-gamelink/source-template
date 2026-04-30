import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Container, Row, Col } from 'react-bootstrap';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
};

const AboutPage = async () => {
  const session = await auth();

  if (session?.user?.role === 'ADMIN') {
    redirect('/admin/manage');
  }

  return (
    <main>
      <Container className="py-1 mt-5">
        <h1>
          About
          <br />
          UH GameLink
        </h1>

        <div className="shortline pb-4">____________________________</div>

        <p>
          UH GameLink was created by a group of University of Hawai‘i students who share a passion
          for gaming and community building. We noticed that while many students play games,
          there wasn’t an easy way to connect with others on campus who share the same interests.
        </p>

        <br />

        <p>
          Our goal is to provide a platform where students can discover new games, find teammates,
          and build friendships through gaming. Whether you enjoy competitive shooters, casual
          sandbox games, or anything in between, UH GameLink helps bring players together.
        </p>

        <br />

        <h3 className="text-center mb-4">Meet the Team</h3>

        <Row className="text-center justify-content-center">
          <Col xs={6} md={2} className="mb-4">
            <a href="https://ellaself.github.io/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/team/ella.jpg"
                alt="Ella Self"
                width={120}
                height={120}
                className="rounded-circle"
              />
              <p className="mt-2"><strong>Ella Self</strong></p>
            </a>
          </Col>

          <Col xs={6} md={2} className="mb-4">
            <a href="https://johngabrielmartinez.github.io/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/team/john.jpg"
                alt="John Gabriel Martinez"
                width={120}
                height={120}
                className="rounded-circle"
              />
              <p className="mt-2"><strong>John Gabriel Martinez</strong></p>
            </a>
          </Col>

          <Col xs={6} md={2} className="mb-4">
            <a href="https://mtuando.github.io/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/team/tuan.jpg"
                alt="Tuan Do"
                width={120}
                height={120}
                className="rounded-circle"
              />
              <p className="mt-2"><strong>Tuan Do</strong></p>
            </a>
          </Col>

          <Col xs={6} md={2} className="mb-4">
            <a href="https://mvuong808.github.io/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/team/mason.jpg"
                alt="Mason Vuong"
                width={120}
                height={120}
                className="rounded-circle"
              />
              <p className="mt-2"><strong>Mason Vuong</strong></p>
            </a>
          </Col>

          <Col xs={6} md={2} className="mb-4">
            <a href="https://peytony9.github.io/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/team/peyton.jpg"
                alt="Peyton Young"
                width={120}
                height={120}
                className="rounded-circle"
              />
              <p className="mt-2"><strong>Peyton Young</strong></p>
            </a>
          </Col>
        </Row>

        <br />

        <p>
          This project was built using Next.js, Prisma, and React Bootstrap as part of a
          collaborative software development course.
        </p>
      </Container>
    </main>
  );
};

export default AboutPage;