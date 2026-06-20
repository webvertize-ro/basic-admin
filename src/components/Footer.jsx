import styled from 'styled-components';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContentInner } from '../hooks/useContent';
import { c } from '../utils/content';

const StyledFooter = styled.footer`
  background: rgba(46, 32, 24, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 1px solid rgba(232, 168, 124, 0.12);
  padding: 0.75rem 1.5rem;
  color: rgba(232, 168, 124, 0.6);
  font-size: 0.78rem;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direciton: column;
    align-items: center;
    text-align: center;
    gap: 0.25rem;
  }
`;

const Copyright = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 0.9rem;
  color: rgba(232, 168, 124, 0.5);
`;

function Footer() {
  const {contentMap} = useContentInner();
  const year = new Date().getFullYear();

  return <StyledFooter>
    <FooterInner>
      <Copyright>
        <StyledFontAwesomeIcon icon={faCopyright} />
        <span>Toate drepturile rezervate.</span>
      </Copyright>
      <span>{c(contentMap, 'global.brand_name')}</span>
      <span>{year}</span>
    </FooterInner>
  </StyledFooter>
}

export default Footer;
