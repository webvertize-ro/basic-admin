import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  width: ${({ $size }) => ($size === "small" ? "320px" : "480px")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(27, 60, 83, 0.97);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(127, 165, 184, 0.15);
  border-radius: 12px;
  z-index: 103;
  color: #fff;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 576px) {
    width: calc(100vw - 2rem);
    max-height: 85vh;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid rgba(127, 165, 184, 0.1);
  flex-shrink: 0;
`;

const ModalContent = styled.div`
  overflow-y: auto;
  padding: 0 1rem 1rem;
  flex: 1;
`;

const StyledH4 = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #fff;

  @media (max-width: 576px) {
    font-size: 0.85rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 102;
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid rgba(127, 165, 184, 0.2);
  border-radius: 6px;
  color: rgba(127, 165, 184, 0.6);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(127, 165, 184, 0.1);
    color: #fff;
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  // Disable scrolling when the modal is open
  useEffect(() => {
    if (openName) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [openName]);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({
  children,
  name,
  title = "Solicită o ofertă",
  lightboxOpen,
  size,
}) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(lightboxOpen ? () => {} : close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref} $size={size}>
        <Header>
          <StyledH4>{title}</StyledH4>
          <CloseButton onClick={close}>
            <FontAwesomeIcon icon={faXmark} />
          </CloseButton>
        </Header>
        <ModalContent>
          {cloneElement(children, { onCloseModal: close })}
        </ModalContent>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
