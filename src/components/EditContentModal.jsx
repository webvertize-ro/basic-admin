// components/EditContentModal.jsx
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTextContent, updateImageContent } from '../services/apiContent';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import { c } from '../utils/content';
import { useContentInner } from '../hooks/useContent';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: rgba(46, 32, 24, 0.97);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(232, 168, 124, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  color: #fff;

  @media (max-width: 600px) {
    padding: 1.25rem 1rem;
    max-height: 85vh;
  }
`;

const ModalTop = styled.div`
  margin-bottom: 0.25rem;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: 1px solid rgba(232, 168, 124, 0.2);
  border-radius: 6px;
  color: rgba(232, 168, 124, 0.6);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  padding: 0;

  &:hover {
    background: rgba(232, 168, 124, 0.1);
    color: #fff;
  }
`;

const ModalTitle = styled.h5`
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #fff;
  margin: 0 0 0.25rem;
  padding-right: 2rem;
`;

const FieldMeta = styled.p`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(232, 168, 124, 0.45);
  margin: 0 0 1.25rem;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 1px solid rgba(232, 168, 124, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: 0.5rem;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: rgba(232, 168, 124, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(232, 168, 124, 0.5);
    background: rgba(255, 255, 255, 0.09);
  }
`;

const PreviewHint = styled.div`
  font-size: 0.78rem;
  color: rgba(232, 168, 124, 0.5);
  margin-bottom: 1rem;
  font-style: italic;
`;

const FieldLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(232, 168, 124, 0.45);
  margin-bottom: 0.35rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImageChange = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const CurrentImage = styled.div``;

const NewImage = styled.div`
  position: relative;
`;

const StyledImg = styled.img`
  max-width: 160px;
  border-radius: 6px;
  border: 1px solid rgba(232, 168, 124, 0.15);
  display: block;
  margin-top: 0.4rem;
`;

const DismissButton = styled.button`
  background: rgba(220, 37, 37, 0.15);
  border: 1px solid rgba(220, 37, 37, 0.35);
  border-radius: 50%;
  color: #f87171;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: background 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(220, 37, 37, 0.3);
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 0.75rem;
`;

const UploadButtonContainer = styled.div`
  display: flex;
  margin-bottom: 1.25rem;
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(232, 168, 124, 0.3);
  background: transparent;
  color: rgba(232, 168, 124, 0.8);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(232, 168, 124, 0.1);
    color: #fff;
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  padding: 0.45rem 1.25rem;
  border-radius: 6px;
  border: 1px solid rgba(232, 168, 124, 0.2);
  background: transparent;
  color: rgba(232, 168, 124, 0.6);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(232, 168, 124, 0.08);
    color: rgba(232, 168, 124, 0.9);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const StyledP = styled.p`
  font-size: 12px;
  color: #000;
`;

const NewImageText = styled.div`
  display: flex;
`;

const SaveBtn = styled.button`
  padding: 0.45rem 1.25rem;
  border-radius: 6px;
  border: 1px solid rgba(232, 168, 124, 0.4);
  background: rgba(232, 168, 124, 0.14);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(232, 168, 124, 0.22);
    border-color: rgba(232, 168, 124, 0.6);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;


const StyledLabel = styled.label`
  display: flex;
  gap: 0.25rem;
  font-size: 1.2rem;
  color: black;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: #68808e;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;


const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(232, 168, 124, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: border-color 0.15s ease;

  option {
    background: #2e2018;
    color: #fff;
  }

  &:focus {
    outline: none;
    border-color: rgba(232, 168, 124, 0.5);
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(232, 168, 124, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: rgba(232, 168, 124, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(232, 168, 124, 0.5);
    background: rgba(255, 255, 255, 0.09);
  }
`;


function EditContentModal({ field, onClose }) {
  const { contentMap } = useContentInner();
  const {websiteId} = useAuth();
  const queryClient = useQueryClient();

  const parsedSocial = field.content_type === 'social_link' ? JSON.parse(field.value || '{"platform": "facebook", "url": ""}') : null;

  const [textValue, setTextValue] = useState(field?.values);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [socialPlatform, setSocialPlatform] = useState(parsedSocial?.platform || 'facebook');
  const [socialUrl, setSocialUrl] = useState(parsedSocial?.url || '');

  const ref = useOutsideClick(onClose);
  const date = c(contentMap, 'cookies.info_paragraph_1_date');

  function handleFileSelect(file) {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageFile(file);
  }

  const {mutate: saveContent, isPending} = useMutation({
    mutationFn: (variables) => {
      if (field?.content_type === 'image_url') return updateImageContent(variables);
      return updateTextContent(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', websiteId] });
      toast.success('Conținut actualizat!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Eroare la actualizare');
    }
  });

  function handleSave() {
    if (field?.content_type === 'image_url') {
      if (!imageFile) return toast.error('Selectează o imagine');
      saveContent({ id: field?.id, websiteId, key: field?.key, file: imageFile });
    } else if (field.content_type === 'social_link') {
      saveContent({ id: field.id, value: JSON.stringify({ platform: socialPlatform, url: socialUrl }) });
    } else {
      saveContent({ id: field?.id, value: textValue });
    }
  }

  const platformOptions = [
    {value: 'facebook', label: "Facebook"},
    {value: 'instagram', label: 'Instagram'},
    {value: 'youtube', label: 'YouTube'},
    {
      value: 'linkedin', label: 'LinkedIn'
    },
    {value: 'tiktok', label: 'TikTok'}
  ];

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl])

  return <Overlay>
    <Modal ref={ref}>
      <ModalTop>
        <CloseBtn onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </CloseBtn>
        <ModalTitle>{field?.label}</ModalTitle>
      </ModalTop>
      <FieldMeta>{field?.page} › {field?.section}</FieldMeta>

      {
        field?.content_type === 'text' ? <>
          <StyledTextarea value={textValue} onChange={(e) => setTextValue(e.target.value)} rows={4} />
            {
              field.section === 'info' && textValue?.includes("{date}") && <PreviewHint>
                Previzualizare: {textValue.replace("{date}", date)}
              </PreviewHint>
            }
        </> : field?.content_type === 'social_link' ? <div>
            <FieldLabel>Platformă</FieldLabel>
            <StyledSelect value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)}>
              {
                platformOptions.map((opt) => <option key={opt.value} value={opt.value}>
                  {
                    opt.label
                  }
                </option>)
              }
            </StyledSelect>
            <FieldLabel>Link</FieldLabel>
            <StyledInput type="url" value={socialUrl} onChange={(e) => setSocialUrl(e.target.value)} placeholder="https://facebook.com/pagina-firmei" />
        </div> : <div>
          <ImageChange>
            <CurrentImage>
              <FieldLabel>Imaginea actuală</FieldLabel>
              <StyledImg src={field?.value} alt={field?.label} />
            </CurrentImage>
            {
              previewUrl && <NewImage>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FieldLabel>Imagine nouă</FieldLabel>
                  <DismissButton onClick={() => setPreviewUrl('')}>
                    <StyledFontAwesomeIcon icon={faXmark} />
                  </DismissButton>
                </div>

                <StyledImg src={previewUrl} alt="" />
              </NewImage>
            }
          </ImageChange>
          <UploadButtonContainer>
            <UploadLabel htmlFor="image">
              <FontAwesomeIcon icon={faUpload} />
              <span>Încarcă imagine</span>
            </UploadLabel>
            <HiddenFileInput id="image" type="file" accept="image/*" onChange={(e) => {
              handleFileSelect(e.target.files[0]);
              e.target.value = null;
            }} />
          </UploadButtonContainer>
        </div>
      }

      <ActionButtonsContainer>
        <CancelBtn onClick={onClose} disabled={isPending}>Anulează</CancelBtn>
        <SaveBtn onClick={handleSave} disabled={isPending}>
          { isPending ? 'Se salvează...' : 'Salvează' }
        </SaveBtn>
      </ActionButtonsContainer>
    </Modal>
  </Overlay>
}

export default EditContentModal;
