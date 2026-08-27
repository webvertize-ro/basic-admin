import styled from "styled-components";
import Modal from "./Modal";
import DeleteModalInner from "./DeleteModalInner";

const StyledRequest = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 1.25rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: rgba(27, 60, 83, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(127, 165, 184, 0.1);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(127, 165, 184, 0.35);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StyledUl = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
`;

const StyledLi = styled.li`
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const FieldLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(127, 165, 184, 1);
  margin-right: 0.4rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 600px) {
    flex-direction: row;
  }
`;

const DeleteButton = styled.button`
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: 1px solid rgba(248, 113, 113, 0.3);
  background: transparent;
  color: rgba(248, 113, 113, 0.8);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(248, 113, 113, 0.12);
    color: #fca5a5;
  }
`;

function Request({ name, email, message, date, id, onDelete }) {
  const formattedDate = new Intl.DateTimeFormat("ro-RO", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));

  return (
    <StyledRequest>
      <StyledUl>
        <StyledLi>
          <FieldLabel>Nume</FieldLabel>
          {name}
        </StyledLi>
        <StyledLi>
          <FieldLabel>Email</FieldLabel>
          {email}
        </StyledLi>
        <StyledLi>
          <FieldLabel>Mesaj</FieldLabel>
          {message}
        </StyledLi>
        <StyledLi>
          <FieldLabel>Dată</FieldLabel>
          {formattedDate}
        </StyledLi>
      </StyledUl>
      <ActionButtons>
        <Modal>
          <Modal.Open opens="delete-confirmation">
            <DeleteButton>Șterge</DeleteButton>
          </Modal.Open>
          <Modal.Window
            name="delete-confirmation"
            title="Confirmare acțiune"
            size="small"
          >
            <DeleteModalInner id={id} onDelete={onDelete} />
          </Modal.Window>
        </Modal>
      </ActionButtons>
    </StyledRequest>
  );
}

export default Request;
