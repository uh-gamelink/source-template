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

  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    if (status !== 'authenticated' || isAdmin) {
      return;
    }

    let ignore = false;

    const fetchProfile = async () => {
      setIsLoadingProfile(true);

      try {
        const res = await fetch('/api/profile/me');

        if (!res.ok) {
          return;
        }

        const data: ProfileData = await res.json();

        if (!ignore) {
          setProfileData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, [status, isAdmin]);

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
    status === 'authenticated' && isLoadingProfile && !isAdmin;

  const profileImage = isCheckingProfile
    ? ''
    : hasUploadedProfilePicture
      ? rawProfilePicture
      : generatedAvatar;

  const getNavLinkClass = (href: string) =>
    pathName === href ? 'custom-nav-link active-nav-link' : 'custom-nav-link';

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand
          as={Link}
          href={isAdmin ? '/admin/manage' : '/'}
          className="d-flex align-items-center gap-2 custom-brand"
        >
          <GiGamepad size={32} />
          <span>
            <strong> UH GameLink</strong>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar-nav"
          className="custom-navbar-toggle"
        />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto gap-3">
            {!isAdmin && (
              <>
                <Nav.Link
                  as={Link}
                  href="/gamelibrary"
                  active={pathName === '/gamelibrary'}
                  className={getNavLinkClass('/gamelibrary')}
                >
                  Game Library
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  href="/community"
                  active={pathName === '/community'}
                  id="community-nav"
                  className={getNavLinkClass('/community')}
                >
                  Community
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  href="/reviews"
                  active={pathName === '/reviews'}
                  className={getNavLinkClass('/reviews')}
                >
                  Reviews
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  href="/about"
                  active={pathName === '/about'}
                  className={getNavLinkClass('/about')}
                >
                  About Us
                </Nav.Link>

                {session && (
                  <Nav.Link
                    as={Link}
                    href="/findplayers"
                    active={pathName === '/findplayers'}
                    id="findplayers-nav"
                    className={getNavLinkClass('/findplayers')}
                  >
                    Find Players
                  </Nav.Link>
                )}

                {session && (
                  <Nav.Link
                    as={Link}
                    href="/profile"
                    active={pathName === '/profile'}
                    id="profile-nav"
                    className={getNavLinkClass('/profile')}
                  >
                    Profile
                  </Nav.Link>
                )}
              </>
            )}

            {isAdmin && (
              <Nav.Link
                as={Link}
                href="/admin/manage"
                active={pathName === '/admin/manage'}
                className={getNavLinkClass('/admin/manage')}
              >
                Manage
              </Nav.Link>
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
                        key={profileImage}
                        src={profileImage}
                        alt={isAdmin ? 'Admin avatar' : 'Profile picture'}
                        width={49}
                        height={49}
                        className="rounded-circle navbar-profile-img"
                        style={{
                          objectFit: 'cover',
                          border: '2px solid rgba(127, 153, 255, 0.85)',
                          boxShadow: '0 0 8px rgba(127, 153, 255, 0.45)',
                        }}
                        unoptimized={
                          profileImage.startsWith('blob:') ||
                          profileImage.startsWith('/api/avatar') ||
                          profileImage.includes('public.blob.vercel-storage.com')
                        }
                      />
                    ) : (
                      <div
                        className="rounded-circle navbar-profile-img"
                        style={{
                          width: 49,
                          height: 49,
                          backgroundColor: '#101c37',
                          border: '2px solid rgba(127, 153, 255, 0.85)',
                          boxShadow: '0 0 8px rgba(127, 153, 255, 0.45)',
                        }}
                      />
                    )}

                    <span>{isAdmin ? 'Admin' : currentUser}</span>
                  </span>
                }
              >
                <NavDropdown.Item
                  id="login-dropdown-sign-out"
                  href="/auth/signout"
                >
                  <BoxArrowRight className="me-2" />
                  Sign Out
                </NavDropdown.Item>

                <NavDropdown.Item
                  id="login-dropdown-change-password"
                  href="/auth/change-password"
                >
                  <Lock className="me-2" />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item
                  id="login-dropdown-sign-in"
                  href="/auth/signin"
                >
                  <PersonFill className="me-2" />
                  Sign In
                </NavDropdown.Item>

                <NavDropdown.Item
                  id="login-dropdown-sign-up"
                  href="/auth/signup"
                >
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