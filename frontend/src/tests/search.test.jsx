import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SearchPage from '../pages/search';
import { useUser } from '../context/userContext';
import toast from 'react-hot-toast';

// Mock Firebase module to stub db
jest.mock('../Firebase/firebase', () => ({
  db: {},
}));

// Mock Firestore methods
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(id => id),
}));

// Mock user context
jest.mock('../context/userContext', () => ({
  useUser: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => <div />,  
}));

// Mock fetch (unused in current tests)
global.fetch = jest.fn();

describe('SearchPage Component', () => {
  const mockDocuments = [
    { id: '1', fileName: 'Test.pdf', filePath: '/test.pdf', uploadDate: '2025-05-01', tags: ['tag1'], visibility: 'public' },
    { id: '2', fileName: 'Secret.docx', filePath: '/secret.docx', uploadDate: '2025-05-02', tags: ['tag2'], visibility: 'private' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    require('firebase/firestore').getDocs.mockResolvedValue({ docs: mockDocuments.map(d => ({ id: d.id, data: () => ({
      fileName: d.fileName,
      filePath: d.filePath,
      uploadDate: d.uploadDate,
      tags: d.tags,
      visibility: d.visibility,
    }) })) });
    useUser.mockReturnValue({ user: null });
  });

  const renderWithRouter = () => render(
    <MemoryRouter>
      <SearchPage />
    </MemoryRouter>
  );

  it('renders loading then public documents', async () => {
    renderWithRouter();
    expect(screen.getByText(/loading documents/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading documents/i)).not.toBeInTheDocument());
    expect(screen.getByText('Test.pdf')).toBeInTheDocument();
    expect(screen.queryByText('Secret.docx')).not.toBeInTheDocument();
  });

  it('filters by file name shows no results', async () => {
    renderWithRouter();
    await waitFor(() => screen.getByText('Test.pdf'));
    const input = screen.getByPlaceholderText(/search by file name/i);
    fireEvent.change(input, { target: { value: 'xyz' } });
    expect(screen.getByText(/no documents found/i)).toBeInTheDocument();
  });

  it('toggles tag filter dropdown', async () => {
    renderWithRouter();
    // The Filter button has visible text 'Filter'
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    // Now the tag select should appear
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows error when bookmarking without user', async () => {
    renderWithRouter();
    await waitFor(() => screen.getByText('Test.pdf'));
    const bookmarkBtn = screen.getByRole('button', { name: /bookmark/i });
    fireEvent.click(bookmarkBtn);
    expect(toast.error).toHaveBeenCalledWith('You must be signed in to bookmark.');
  });
});
