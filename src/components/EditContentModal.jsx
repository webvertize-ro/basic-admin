// components/EditContentModal.jsx
import { useState } from 'react';
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 480px;
  position: relative;
`;

const ModalTop = styled.div``;

const CloseBtn = styled.button`
  border: none;
  background-color: transparent;
  position: absolute;
  top: -0.5rem;
  right: -0.25rem;
  padding: 1rem;
`;

const ModalTitle = styled.h5`
  color: #000;
`;

const StyledP = styled.p`
  font-size: 12px;
  color: #000;
`;

const StyledTextarea = styled.textarea`
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const ImageChange = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const CurrentImage = styled.div``;

const NewImage = styled.div`
  position: relative;
`;

const NewImageText = styled.div`
  display: flex;
`;

const DismissButton = styled.button`
  background-color: transparent;
  border: none;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc2525;
  border-radius: 50%;
  color: #fff;
  display: flex;
  padding: 0.25rem;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 0.75rem;
`;

const StyledImg = styled.img`
  max-width: 200px;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
`;

const UploadButtonContainer = styled.div`
  display: flex;
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

const StyledInput = styled.input`
  margin-bottom: 1rem;
  display: none;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  background-color: #88304e;
  color: #fff;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
`;

const SaveBtn = styled.button`
  background-color: #285a48;
  color: #fff;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
`;

function EditContentModal({ field, onClose }) {
  const { contentMap } = useContentInner();
  const { websiteId } = useAuth();
  const queryClient = useQueryClient();
  // parse the existing JSON value for social_link fields
  const parsedSocial =
    field.content_type === 'social_link'
      ? JSON.parse(field.value || '{"platform": "facebook", "url": ""}')
      : null;

  const [textValue, setTextValue] = useState(field?.value);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  // state for social platform and URL (of that platform)
  const [socialPlatform, setSocialPlatform] = useState(
    parsedSocial?.platform || 'facebook',
  );
  const [socialUrl, setSocialUrl] = useState(parsedSocial?.url || '');

  function handleFileSelect(file) {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageFile(file);
  }

  const { mutate: saveContent, isPending } = useMutation({
    mutationFn: (variables) => {
      if (field?.content_type === 'image_url') {
        return updateImageContent(variables);
      }
      return updateTextContent(variables);
    },
    onSuccess: () => {
      // invalidate the content query so the list refreshes
      queryClient.invalidateQueries({ queryKey: ['content', websiteId] });
      toast.success('Conținut actualizat!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Eroare la actualizare');
    },
  });

  function handleSave() {
    if (field?.content_type === 'image_url') {
      if (!imageFile) return toast.error('Selectează o imagine');
      saveContent({
        id: field?.id,
        websiteId,
        key: field?.key,
        file: imageFile,
      });
    } else if (field.content_type === 'social_link') {
      // serialize back to JSON string before saving
      const value = JSON.stringify({
        platform: socialPlatform,
        url: socialUrl,
      });
      saveContent({ id: field.id, value });
    } else {
      saveContent({ id: field?.id, value: textValue });
    }
  }

  const platformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
  ];

  const ref = useOutsideClick(field ? onClose : {});
  const date = c(contentMap, 'cookies.info_paragraph_1_date');

  return (
    <Overlay>
      <Modal ref={ref}>
        <ModalTop>
          <CloseBtn onClick={() => onClose()}>
            <FontAwesomeIcon icon={faX} />
          </CloseBtn>
          <ModalTitle>{field?.label}</ModalTitle>
        </ModalTop>
        <StyledP>
          <strong>Conținutul editat: </strong>
          {field?.page} › {field?.section}
        </StyledP>

        {field?.content_type === 'text' ? (
          <StyledTextarea
            value={
              field.section === 'info'
                ? textValue.replace('{date}', date)
                : textValue
            }
            onChange={(e) => setTextValue(e.target.value)}
            rows={4}
          />
        ) : field?.content_type === 'social_link' ? (
          <div>
            <label>Platformă</label>
            <select
              value={socialPlatform}
              onChange={(e) => setSocialPlatform(e.target.value)}
            >
              {platformOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label>Link</label>
            <input
              type="url"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              placeholder="https://facebook.com/pagina-ta"
            />
          </div>
        ) : (
          <div>
            <ImageChange className="mb-2">
              <CurrentImage>
                <div className="text-dark">Imaginea actuala: </div>

                <StyledImg
                  src={field?.value}
                  alt={field?.label}
                  className="img-fluid"
                />
              </CurrentImage>
              {previewUrl && (
                <NewImage>
                  <div className="d-flex justify-content-between ">
                    <NewImageText className="text-dark">
                      Noua imagine:{' '}
                    </NewImageText>
                    <DismissButton onClick={() => setPreviewUrl('')}>
                      <StyledFontAwesomeIcon icon={faXmark} />
                    </DismissButton>
                  </div>

                  <StyledImg src={previewUrl} alt="" className="img-fluid" />
                </NewImage>
              )}
            </ImageChange>

            <UploadButtonContainer>
              <StyledLabel htmlFor="image">
                <span>
                  <FontAwesomeIcon icon={faUpload} />
                </span>
                <span>Încarcă imagine</span>
              </StyledLabel>
              <StyledInput
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileSelect(e.target.files[0]);
                  e.target.value = null;
                }}
              />
            </UploadButtonContainer>
          </div>
        )}

        <ActionButtonsContainer>
          <CancelBtn onClick={onClose} disabled={isPending}>
            Anulează
          </CancelBtn>
          <SaveBtn onClick={handleSave} disabled={isPending}>
            {isPending ? 'Se salvează...' : 'Salvează'}
          </SaveBtn>
        </ActionButtonsContainer>
      </Modal>
    </Overlay>
  );
}

export default EditContentModal;
