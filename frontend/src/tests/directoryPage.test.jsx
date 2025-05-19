import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import Directory from '../pages/directory';
import { MemoryRouter } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { handleLogout } from '../Firebase/authorisation';
import { useNavigate } from 'react-router-dom';

jest.mock('../context/userContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('../Firebase/authorisation', () => ({
  handleLogout: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../components/NavigationComponent', () => () => (
  <div>NavigationComponent</div>
));

jest.mock('../components/IconButton', () => ({ icon, label, route, onClick }) => (
  <button onClick={onClick} data-testid={`icon-${label}`} data-route={route}>
    {label}
  </button>
));

jest.mock('../components/DirectoryComponents/FileUploadModal', () => ({
  showModal,
  handleClose,
  modalStep,
  setModalStep,
  uploadedFile,
  setUploadedFile,
}) => (
  showModal ? (
    <div>
      <p>Modal Open</p>
      <button onClick={handleClose}>Close Modal</button>
    </div>
  ) : null
));

describe('Directory Page', () => {
  const mockNavigate = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);

    useUser.mockReturnValue({
      user: {
        uid: 'user123',
        email: 'user@example.com',
      },
      loading: false,
      setUser: mockSetUser,
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Directory />
        </MemoryRouter>
      );
    });
  });

  it('should render directory UI correctly with buttons and sections', () => {
    expect(screen.getByRole('heading', { name: 'Directory' })).toBeInTheDocument();
    expect(screen.getByText('NavigationComponent')).toBeInTheDocument();

    expect(screen.getByTestId('icon-My Profile')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Bookmarks')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Log Out')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Settings')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Upload File')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Create Folder')).toBeInTheDocument();
  });

  it('should open and close the upload file modal', async () => {
    const uploadBtn = screen.getByTestId('icon-Upload File');

    await act(async () => {
      fireEvent.click(uploadBtn);
    });

    expect(screen.getByText('Modal Open')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Close Modal'));
    });

    expect(screen.queryByText('Modal Open')).not.toBeInTheDocument();
  });

  it('should call handleLogout and not navigate anywhere explicitly', async () => {
    const logoutBtn = screen.getByTestId('icon-Log Out');

    await act(async () => {
      fireEvent.click(logoutBtn);
    });

    expect(handleLogout).toHaveBeenCalledTimes(1);
    expect(handleLogout).toHaveBeenCalledWith(mockSetUser, mockNavigate);
  });

  it('should render loading message when loading is true', async () => {
    useUser.mockReturnValue({
      user: null,
      loading: true,
      setUser: mockSetUser,
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Directory />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument();
  });

  it("should return null if there is no user", async () => {
    useUser.mockReturnValue({
      user: null,
      loading: false,
      setUser: mockSetUser,
    });

    const { container } = render(
      <MemoryRouter>
        <Directory />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull(); 
  });
});