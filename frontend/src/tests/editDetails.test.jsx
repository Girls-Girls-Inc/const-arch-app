import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditUploadDetails from '../pages/editDetails.jsx';
import { getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Mock Firebase config
jest.mock('../Firebase/firebase', () => ({ db: {} }));

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn((db, collection, id) => ({ collection, id })),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  Timestamp: { now: jest.fn().mockReturnValue(new Date(0)) }
}));

// Mock router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'test123' }),
  useNavigate: () => mockNavigate
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />, 
  toast: { error: jest.fn(), success: jest.fn() }
}));

describe('EditUploadDetails', () => {
  const mockData = {
    fileName: 'test.txt',
    fileType: 'text',
    uploadedBy: 'user1',
    uploadDate: '2023-01-01',
    bookmarkCount: 5,
    directoryId: 'dir1',
    visibility: 'public',
    tags: ['tag1', 'tag2'],
    updatedAt: { toDate: () => new Date() }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays upload data', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockData });

    render(<EditUploadDetails />);

    expect(getDoc).toHaveBeenCalledWith({ collection: 'upload', id: 'test123' });

    await waitFor(() => {
      expect(screen.getByDisplayValue('test.txt')).toBeInTheDocument();
      expect(screen.getByDisplayValue('tag1, tag2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('public')).toBeInTheDocument();
    });
  });

  test('handles document not found', async () => {
    getDoc.mockResolvedValue({ exists: () => false });

    render(<EditUploadDetails />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Upload not found');
      expect(mockNavigate).toHaveBeenCalledWith('/manageUploads');
    });
  });

  test('handles fetch error', async () => {
    getDoc.mockRejectedValue(new Error('Firestore error'));

    render(<EditUploadDetails />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch upload: Firestore error');
    });
  });

  test('updates document successfully', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockData });

    render(<EditUploadDetails />);

    await waitFor(() => {}); // wait for initial load

    fireEvent.change(screen.getByLabelText('File Name'), { target: { value: 'updated.txt' } });
    fireEvent.change(screen.getByLabelText('Bookmark Count'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Tags'), { target: { value: 'newtag1, newtag2' } });
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        { collection: 'upload', id: 'test123' },
        expect.objectContaining({
          fileName: 'updated.txt',
          bookmarkCount: 10,
          tags: ['newtag1', 'newtag2'],
          updatedAt: expect.any(Date)
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Upload details updated');
      expect(mockNavigate).toHaveBeenCalledWith('/editUpload/test123');
    });
  });

  test('handles invalid bookmark count', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockData });

    render(<EditUploadDetails />);

    await waitFor(() => {});

    fireEvent.change(screen.getByLabelText('Bookmark Count'), { target: { value: 'invalid' } });
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ bookmarkCount: NaN })
      );
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('handles update error', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockData });
    updateDoc.mockRejectedValue(new Error('Update failed'));

    render(<EditUploadDetails />);

    await waitFor(() => {});
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Update failed: Update failed');
    });
  });

  test('renders form with all fields', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockData });

    render(<EditUploadDetails />);

    await waitFor(() => {
      expect(screen.getByLabelText('File Name')).toBeInTheDocument();
      expect(screen.getByLabelText('File Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Visibility')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });
});
