import React, { useState } from 'react';
import Logo from './Logo';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Modal from './EditContentModal';

const NavContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 101;
  width: 100%;
`;

const StyledNav = styled.nav`
  height: 64px;
  display: flex;
  align-items: center;
  background: rgba(46, 32, 24, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(232, 168, 124, 0.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 0 1.5rem;

  @media (max-width: 992px) {
    height: auto;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
  }
`;

const NavInner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 1rem;

  @media (max-width: 992px) {
    flex-wrap: wrap;
    height: auto;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  height: 64px;
  gap: 0.25rem;

  @media (max-width: 992px) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: auto;
    padding: 0.5rem 0 0.75rem;
    gap: 0;
    order: 3;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 992px) {
    order: 2;
  }
`;

const StyledLi = styled.li`
  display: flex;
  align-items: center;
  height: 64px;

  @media (max-width: 992px) {
    height: auto;
    width: 100%;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(232, 168, 124, 0.8);
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  text-decoration: none;
  border-bottom: 3px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  
  &:hover {
    color: #e8a87c;
    border-bottom-color: rgba(232, 168, 124, 0.4);
  }

  &.active {
    color: #fff;
    border-bottom-color: #e8a87c;
  }

  @media (max-width: 992px) {
    height: auto;
    width: 100%;
    padding: 0.65rem 0.5rem;
    border-bottom: none;
    border-left: 3px solid transparent;

    &:hover {
      border-bottom: none;
      border-left-color: rgba(232, 168, 124, 0.4);
    }

    &.active {
      border-bottom: none;
      border-left-color: #e8a87c;
    }
  }
`;

const LogoutButton = styled.button`
  padding: 0.35rem 0.9rem;
  border-radius: 6px;
  border: 1px solid rgba(232, 168, 124, 0.25);
  background: transparent;
  color: rgba(232, 168, 124, 0.7);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(232, 168, 124, 0.08);
    color: rgba(232, 168, 124, 0.95);
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: 1px solid rgba(232, 168, 124, 0.3);
  border-radius: 6px;
  color: #e8a87c;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  transition: background 0.2s ease;
  order: 2;

  &:hover {
    background: rgba(126, 200, 176, 0.1);
  }

  @media (max-width: 992px) {
    display: flex;
    align-items: center;
  }
`;

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return <NavContainer>
    <StyledNav>
      <NavInner>
        <a href="#">
          <Logo />
        </a>
        <MobileToggle onClick={() => setMenuOpen((prev) => !prev)}>
          {menuOpen ? '✕' : '☰'}
        </MobileToggle>

        <NavLinks $open={menuOpen}>
          <StyledLi>
            <StyledNavLink to="/requests">Solicitări</StyledNavLink>
          </StyledLi>
          <StyledLi>
            <StyledNavLink to="/admin">Administrare conținut</StyledNavLink>
          </StyledLi>
        </NavLinks>
        <NavRight>
          <LogoutButton onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}>Deconectare</LogoutButton>
        </NavRight>
      </NavInner>
    </StyledNav>
  </NavContainer>
}

export default Navigation;
