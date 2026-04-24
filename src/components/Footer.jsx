import styled from 'styled-components';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContentInner } from '../hooks/useContent';
import { c } from '../utils/content';

const StyledFooter = styled.footer`
  display: flex;
  background-color: #9db2bf;
  padding: 0.5rem;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Copyright = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BusinessName = styled.div``;

const Year = styled.div``;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  color: #000;
`;

function Footer() {
  const { contentMap } = useContentInner();

  const currentYear = new Date();
  const year = currentYear.getFullYear();
  return (
    <StyledFooter>
      <Container className="container">
        {/* Copyright */}
        <Copyright>
          <StyledFontAwesomeIcon icon={faCopyright} />
          <p>Toate drepturile rezervate.</p>
        </Copyright>
        {/* Business Name  */}
        <BusinessName>{c(contentMap, 'global.brand_name')}</BusinessName>

        {/* Year */}
        <Year>{year}</Year>
      </Container>
    </StyledFooter>
  );
}

export default Footer;
