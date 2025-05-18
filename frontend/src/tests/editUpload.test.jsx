// Stub next/link as a virtual module so Jest won't attempt resolution
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href, ...props }) => <a href={href} {...props}>{children}</a> }), { virtual: true });

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import EditUpload from '../pages/editUpload.jsx';
import * as userContextModule from '../context/userContext';
import * as reactRouterDom from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

// Mock Firebase config
jest.mock('../Firebase/firebase', () => ({ db: {} }));

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn((db, collection, id) => ({ collection, id })),
  getDoc: jest.fn(),
}));

// Mock user context
const mockUser = { uid: 'user1', displayName: 'Test User' };
jest.spyOn(userContextModule, 'useUser').mockImplementation(() => ({ user: mockUser }));

// Mock router hooks
const mockNavigate = jest.fn();
jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => mockNavigate);
jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ id: 'upload123' }));

// Mock toast
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />,
  toast: { loading: jest.fn(), success: jest.fn(), error: jest.fn(), dismiss: jest.fn() }
}));

describe('EditUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    getDoc.mockReturnValue(new Promise(() => {})); // never resolves
    render(<EditUpload />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('handles missing id param', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({}));
    render(<EditUpload />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No upload ID provided');
      expect(screen.queryByRole('status')).toBeFalsy();
      expect(screen.getByText(/Upload not found/i)).toBeInTheDocument();
    });
  });

  test('displays upload data on successful fetch', async () => {
    const mockData = {
      filePath: 'http://file.url',
      fileType: 'pdf',
      fileName: 'document.pdf',
      uploadedBy: 'user1',
      uploadDate: '2023-01-01T00:00:00.000Z',
      bookmarkCount: 7,
      directoryId: 'dir1',
      updatedAt: { toDate: () => new Date('2023-05-01T12:00:00Z') },
      visibility: 'public',
      tags: ['tag1', 'tag2'],
    };
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockData, id: 'upload123' });

    render(<EditUpload />);
    await waitFor(() => expect(getDoc).toHaveBeenCalledWith({ collection: 'upload', id: 'upload123' }));

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('dir1')).toBeInTheDocument();
    mockData.tags.forEach(tag => expect(screen.getByText(tag)).toBeInTheDocument());
  });

  test('handles upload not found', async () => {
    getDoc.mockResolvedValue({ exists: () => false });
    render(<EditUpload />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Upload not found');
      expect(screen.getByText(/Upload not found/i)).toBeInTheDocument();
    });
  });

  test('handles fetch error', async () => {
    getDoc.mockRejectedValue(new Error('Fetch error'));
    render(<EditUpload />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load upload: Fetch error');
    });
  });

  test('copy to clipboard button copies path and shows toast', async () => {
    const mockData = { filePath: 'http://file.url', fileType: 'txt', updatedAt: { toDate: () => new Date() }, id: 'upload123' };
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockData, id: 'upload123' });
    Object.assign(navigator, { clipboard: { writeText: jest.fn() } });

    render(<EditUpload />);
    await waitFor(() => {});
    fireEvent.click(screen.getByTitle('Copy URL'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockData.filePath);
    expect(toast.success).toHaveBeenCalledWith('URL copied to clipboard');
  });
});
