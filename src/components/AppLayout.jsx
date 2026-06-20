import styled from 'styled-components';
import Footer from './Footer';
import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';

const StyledAppLayout = styled.div`
  background: linear-gradient(160deg, #2e2018 0%, #3d2b1f 100%);
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Navigation />
      <Outlet />
      <Footer />
    </StyledAppLayout>
  );
}

export default AppLayout;
