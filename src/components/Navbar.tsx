'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { GiGamepad } from 'react-icons/gi';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();

  if (status === 'loading') return null;

  const currentUser = session?.user?.email;

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand
          as={Link}
          href="/"
          className="d-flex align-items-center gap-2 custom-brand"
        >
          <GiGamepad size={32} />
          <span><strong> UH GameLink</strong> </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" className="custom-navbar-toggle" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/gamelibrary" active={pathName === '/gamelibrary'}>
              Game Library
            </Nav.Link>

            <Nav.Link as={Link} href="/community" active={pathName === '/community'} id="community-nav">
              Community
            </Nav.Link>

            <Nav.Link as={Link} href="/about" active={pathName === "/about"}>
              About Us
            </Nav.Link>

            {session && (
              <Nav.Link as={Link} href="/findplayers" active={pathName === '/findplayers'} id="findplayers-nav">
                Find Players
              </Nav.Link>
            )}

            {session && (
              <Nav.Link as={Link} href="/profile" active={pathName === '/profile'} id="profile-nav">
                Profile
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {session ? (
              <NavDropdown
                id="login-dropdown"
                title={currentUser}
                menuVariant="dark"
              >
                <NavDropdown.Item id="login-dropdown-sign-out" href="/auth/signout">
                  <BoxArrowRight className="me-2" />
                  Sign Out
                </NavDropdown.Item>

                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock className="me-2" />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                id="login-dropdown"
                title="Login"
              >
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
                  <PersonFill className="me-2" />
                  Sign In
                </NavDropdown.Item>

                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
                  <PersonPlusFill className="me-2" />
                  Sign Up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;