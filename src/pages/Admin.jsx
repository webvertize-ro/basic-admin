// pages/Admin.jsx
import { useEffect, useState } from 'react';
import { useContent } from '../hooks/useContent';
import EditContentModal from '../components/EditContentModal';
import LoadingSpinner from '../components/LoadingSpinner';
import styled from 'styled-components';
import { pageLabels, sectionLabels } from '../utils/labels';

const SpinnerContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledAdmin = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: #fff;
  position: relative;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  position: ${(props) => (props.isScrolled ? 'fixed' : 'absolute')};
  top: 80px;
  left: 0;
  right: 0;
  width: 100%;
  background-color: transparent;
  background-color: rgba(255, 255, 255, 0.25);
  z-index: 1000;
  padding: 1.5rem;
`;

const ContentContainer = styled.div`
  padding-top: 175px;
`;

const IndividualTab = styled.div`
  border: 1px solid white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.selected ? '#fff' : 'lightgrey')};
  color: ${(props) => (props.selected ? '#000' : '#fff')};

  &:hover {
    cursor: pointer;
    background-color: #fff;
    color: #000;
  }
`;

const Page = styled.div`
  padding: 2rem;
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div``;

const SectionTitle = styled.div`
  margin-left: 2rem;
  margin-bottom: 0.5rem;
`;

const FieldsContainer = styled.div`
  margin-left: 4rem;
  border: 1px solid #fff;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem;
  border-bottom: 1px solid #e5e7eb;
`;

const FieldContent = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  border: none;
  padding: 0.5rem 2rem;
  border-radius: 0.5rem;
`;

const Label = styled.div`
  font-weight: bold;
  display: flex;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 300;
  line-break: anywhere;
  padding: 0.5rem;
  max-width: 100%;
  overflow-wrap: break-word;
`;

const StyledImg = styled.img`
  max-width: 80px;
`;

function Admin() {
  const { grouped, isLoading } = useContent();
  const [selectedPage, setSelectedPage] = useState('global');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('page')) {
      setSelectedPage(localStorage.getItem('page'));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleSelectedTab(page) {
    if (localStorage.getItem('page')) {
      setSelectedPage(localStorage.getItem('page'));
    }

    setSelectedPage(page);
    // set the selected page in localStorage
    localStorage.setItem('page', page);
  }

  const [editingField, setEditingField] = useState(null);
  console.log('editingField: ', editingField);
  if (isLoading) return <LoadingSpinner />;

  const pages = Object.entries(grouped).map(([page]) => page);

  return (
    <StyledAdmin className="">
      <div>
        {/* Tabs */}
        <Tabs isScrolled={isScrolled}>
          {pages.map((p) => (
            <>
              <IndividualTab
                onClick={() => handleSelectedTab(p)}
                selected={p === selectedPage}
              >
                {pageLabels[p]}
              </IndividualTab>
            </>
          ))}
        </Tabs>
        <ContentContainer>
          <h2>Administrare conținut</h2>
          {Object.entries(grouped).map(([page, sections]) => {
            if (page === selectedPage) {
              return (
                <div>
                  {/* level 1 - iterating over pages */}
                  <Page key={page} className="mb-3">
                    {/* level 2 - iterating over sections within each page */}
                    <SectionsContainer>
                      {Object.entries(sections).map(([section, fields]) => (
                        <Section key={section} className="mb-2">
                          <SectionTitle>
                            Secțiunea: <strong>{sectionLabels[section]}</strong>
                          </SectionTitle>
                          {/* level 3 - iterating over individual fields within each section */}
                          <FieldsContainer>
                            {fields.map((field) => (
                              <Field key={field.id}>
                                <FieldContent>
                                  <Label>{field.label}: </Label>
                                  <Content>
                                    {field.content_type === 'image_url' ? (
                                      <StyledImg
                                        src={field.value}
                                        alt={field.label}
                                      />
                                    ) : (
                                      field.value
                                    )}
                                  </Content>
                                </FieldContent>
                                <EditButton
                                  onClick={() => setEditingField(field)}
                                >
                                  Editează
                                </EditButton>
                              </Field>
                            ))}
                          </FieldsContainer>
                        </Section>
                      ))}
                    </SectionsContainer>
                  </Page>
                </div>
              );
            }
          })}
        </ContentContainer>
      </div>

      {editingField && (
        <EditContentModal
          field={editingField}
          onClose={() => setEditingField(null)}
        />
      )}
    </StyledAdmin>
  );
}

export default Admin;
