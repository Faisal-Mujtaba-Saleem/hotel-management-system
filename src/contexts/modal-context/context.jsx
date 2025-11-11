"use client";

import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export default function ModalContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescJSX, setModalDescJSX] = useState(<></>)

  function populateModal(title, description) {
    // Populate the modal with the selected booking details
    setModalTitle(title);
    setModalDescJSX(description);
    setIsOpen(true);
  }

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, populateModal, modalTitle, modalDescJSX }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useDialog = () => useContext(ModalContext);