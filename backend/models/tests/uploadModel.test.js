import Upload from "../upload";

describe('Upload Model', () =>{
    it('should correctly assign properties when instantiated', () =>{
        const mockData = {
        id: '123',
        fileName: 'mockFileName',
        filePath: '/mock/file/path',
        directoryId: '1234',
        uploadedBy: 'Jane Doe',
        metadataId: 'meta',
        fileType: 'mock',
        tags: ['fake news'],
        uploadDate: '22/03/1983',
        visibility: 'private', 
        bookmarkCount: 109,
        updatedAt: '13/12/2011',
        };

        const upload = new Upload(
            mockData.id,
            mockData.fileName,
            mockData.filePath,
            mockData.directoryId,
            mockData.uploadedBy,
            mockData.metadataId,
            mockData.fileType,
            mockData.tags,
            mockData.uploadDate,
            mockData.visibility,
            mockData.bookmarkCount,
            mockData.updatedAt,
        );

        expect(upload.id).toBe(mockData.id);
        expect(upload.fileName).toBe(mockData.fileName);
        expect(upload.filePath).toBe(mockData.filePath);
        expect(upload.directoryId).toBe(mockData.directoryId);
        expect(upload.uploadedBy).toBe(mockData.uploadedBy);
        expect(upload.metadataId).toBe(mockData.metadataId);
        expect(upload.fileType).toBe(mockData.fileType);
        expect(upload.tags).toEqual(mockData.tags);
        expect(upload.uploadDate).toBe(mockData.uploadDate);
        expect(upload.visibility).toBe(mockData.visibility);
        expect(upload.bookmarkCount).toBe(mockData.bookmarkCount);
        expect(upload.updatedAt).toBe(mockData.updatedAt);
    })
})