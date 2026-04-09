import React from 'react';
import Logo from './Logo';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { logUserOut } from '../services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from './EditContentModal';

const NavContainer = styled.div`
  /* background-color: green; */
`;

const StyledNav = styled.nav`
  /* glassmorphism effect */
  height: 80px;
  padding: 0;
  z-index: 101;
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 992px) {
    height: unset;
    padding: 0.5rem;
  }
`;

const StyledLi = styled.li`
  display: flex;
  align-items: center;
  height: 100%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fff;
    cursor: pointer;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-weight: 500;
  color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  &.active {
    background-color: #fff;
    color: #000;
  }
`;

const LogoutButton = styled.button`
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  text-transform: uppercase;
  background-color: #88304e;
  color: #fff;
`;

function Navigation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logUserOut,
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      toast.error(error.message || 'Could not log out!');
    },
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <NavContainer>
      <StyledNav className="navbar navbar-expand-lg fixed-top">
        <div className="container h-100">
          <a className="navbar-brand" href="#">
            <Logo />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse h-100"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 h-100">
              <StyledLi StyledLiclassName="nav-item">
                <StyledNavLink
                  className="nav-link"
                  aria-current="page"
                  to="/admin"
                >
                  Administrare Conținut
                </StyledNavLink>
              </StyledLi>
              {/* <StyledLi className="nav-item">
                <StyledNavLink
                  className="nav-link"
                  aria-current="page"
                  to="/admin-website"
                >
                  Administrare conținut
                </StyledNavLink>
              </StyledLi> */}
            </ul>
            <div className="d-flex">
              <LogoutButton onClick={() => handleLogout()}>
                Deconectare
              </LogoutButton>
            </div>
          </div>
        </div>
      </StyledNav>
    </NavContainer>
  );
}

export default Navigation;
