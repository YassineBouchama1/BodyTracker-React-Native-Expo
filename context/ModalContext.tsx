import React, { createContext, useReducer, useContext } from 'react';

// Define the types for the modal states
type ModalState = {
  isCameraActive: boolean;
  isProfileFormVisible: boolean;
};

// Define the actions for updating the modal states
type ModalAction =
  | { type: 'OPEN_CAMERA' }
  | { type: 'CLOSE_CAMERA' }
  | { type: 'SHOW_PROFILE_FORM' }
  | { type: 'HIDE_PROFILE_FORM' };

// Initial state for the modals
const initialState: ModalState = {
  isCameraActive: false,
  isProfileFormVisible: false,
};

// Create the context
const ModalContext = createContext<{
  state: ModalState;
  dispatch: React.Dispatch<ModalAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function to handle state updates
const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_CAMERA':
      return {
        ...state,
        isCameraActive: true,
      };
    case 'CLOSE_CAMERA':
      return {
        ...state,
        isCameraActive: false,
      };
    case 'SHOW_PROFILE_FORM':
      return {
        ...state,
        isProfileFormVisible: true,
      };
    case 'HIDE_PROFILE_FORM':
      return {
        ...state,
        isProfileFormVisible: false,
      };
    default:
      return state;
  }
};

// Provider component to wrap your app
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => useContext(ModalContext);