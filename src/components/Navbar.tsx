'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {
  BoxArrowRight,
  Lock,
  PersonFill,
  PersonPlusFill,
} from 'react-bootstrap-icons';
import { GiGamepad } from 'react-icons/gi';

type ProfileData = {
  email: string;
  profile: {
    username: string | null;
    profilePicture: string | null;
  } | null;
};

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;

    let ignore = false;

    const fetchProfile = async () => {
      setIsLoadingProfile(true);

      try {
        const res = await fetch('/api/profile/me');
        if (!res.ok) return;

        const data: ProfileData = await res.json();

        if (!ignore) setProfileData(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setIsLoadingProfile(false);
      }
    };

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, [status]);

  if (status === 'loading') return null;

  const currentUser =
    profileData?.profile?.username ||
    session?.user?.email ||
    'User';

  const avatarSeed =
    session?.user?.email ||
    profileData?.profile?.username ||
    'guest';

  const rawProfilePicture = profileData?.profile?.profilePicture;

  const hasUploadedProfilePicture =
    rawProfilePicture &&
    rawProfilePicture !== 'null' &&
    rawProfilePicture !== 'undefined' &&
    !rawProfilePicture.startsWith('blob:') &&
    !rawProfilePicture.startsWith('/api/avatar') &&
    !rawProfilePicture.includes('dicebear') &&
    rawProfilePicture !== '/default-player.svg' &&
    rawProfilePicture !== '/default-profile.png';

  const generatedAvatar =
    `/api/avatar?seed=${encodeURIComponent(avatarSeed)}&style=pixel-v3`;

  const isCheckingProfile =
    status === 'authenticated' && isLoadingProfile;

  const profileImage = isCheckingProfile
    ? ''
    : hasUploadedProfilePicture
      ? rawProfilePicture
      : generatedAvatar;

  const getNavLinkClass = (href: string) =>
    pathName === href ? 'custom-nav-link active-nav-link' : 'custom-nav-link';


  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand
          as={Link}
          href="/"
          className="d-flex align-items-center gap-2 custom-brand"
        >
          <GiGamepad size={32} />
          <span><strong>UH GameLink</strong></span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar-nav"
          className="custom-navbar-toggle"
        />

        <Navbar.Collapse id="main-navbar-nav">

          <Nav className="me-auto gap-3">

            <Nav.Link
              as={Link}
              href="/gamelibrary"
              className={getNavLinkClass('/gamelibrary')}
            >
              Game Library
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/community"
              className={getNavLinkClass('/community')}
            >
              Community
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/about"
              className={getNavLinkClass('/about')}
            >
              About Us
            </Nav.Link>

         {session && (
          <>
            <Nav.Link
              as={Link}
              href="/findplayers"
              className={getNavLinkClass('/findplayers')}
            >
              Find Players
            </Nav.Link>

            {!isAdmin && (
              <Nav.Link
                as={Link}
                href="/report"
                className={getNavLinkClass('/report')}
              >
                Report Player
              </Nav.Link>
            )}

            <Nav.Link
              as={Link}
              href="/profile"
              className={getNavLinkClass('/profile')}
            >
              Profile
            </Nav.Link>

            {isAdmin && (
              <Nav.Link
                as={Link}
                href="/admin/reports"
                className={getNavLinkClass('/admin/reports')}
              >
                Reports Dashboard
              </Nav.Link>
            )}
          </>
        )}
          </Nav>

          <Nav>
            {session ? (
              <NavDropdown
                id="login-dropdown"
                className="profile-dropdown"
                menuVariant="dark"
                title={
                  <span className="d-inline-flex align-items-center gap-2">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile picture"
                        width={49}
                        height={49}
                        className="rounded-circle navbar-profile-img"
                        style={{
                          objectFit: 'cover',
                          border: '2px solid rgba(127, 153, 255, 0.85)',
                          boxShadow: '0 0 8px rgba(127, 153, 255, 0.45)',
                        }}
                        unoptimized
                      />
                    ) : (
                      <div
                        className="rounded-circle navbar-profile-img"
                        style={{
                          width: 49,
                          height: 49,
                          backgroundColor: '#101c37',
                        }}
                      />
                    )}

                    <span>{currentUser}</span>
                  </span>
                }
              >
                <NavDropdown.Item href="/auth/signout">
                  <BoxArrowRight className="me-2" />
                  Sign Out
                </NavDropdown.Item>

                <NavDropdown.Item href="/auth/change-password">
                  <Lock className="me-2" />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown title="Login">
                <NavDropdown.Item href="/auth/signin">
                  <PersonFill className="me-2" />
                  Sign In
                </NavDropdown.Item>

                <NavDropdown.Item href="/auth/signup">
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