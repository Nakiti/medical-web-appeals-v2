import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { DocumentAnalysisClient } from '@azure/ai-form-recognizer';

/**
 * Azure Blob Storage service for file uploads
 */
export class AzureBlobService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is required');
    }  
    
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerName = process.env.AZURE_CONTAINER_NAME || 'denial-letters';
  }

  /**
   * Upload a file to Azure Blob Storage
   * @param fileBuffer - The file buffer to upload
   * @param fileName - The name for the file in blob storage
   * @returns The URL of the uploaded blob
   */
  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      
      // Ensure container exists
      await containerClient.createIfNotExists();
      
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.uploadData(fileBuffer);
      
      return blockBlobClient.url;
    } catch (error) {
      console.error('Error uploading file to Azure Blob Storage:', error);
      throw new Error('Failed to upload file to Azure Blob Storage');
    }
  }

  /**
   * Upload a generated PDF to Azure Blob Storage
   * @param pdfBuffer - The PDF buffer to upload
   * @param fileName - The name for the file in blob storage
   * @returns The URL of the uploaded blob
   */
  async uploadGeneratedPDF(pdfBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const containerName = process.env.AZURE_GENERATED_CONTAINER_NAME || 'generated-appeals';
      const containerClient = this.blobServiceClient.getContainerClient(containerName);
      
      // Ensure container exists
      await containerClient.createIfNotExists();
      
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.uploadData(pdfBuffer);
      
      return blockBlobClient.url;
    } catch (error) {
      console.error('Error uploading generated PDF to Azure Blob Storage:', error);
      throw new Error('Failed to upload generated PDF to Azure Blob Storage');
    }
  }


  /**
   * Delete a file from Azure Blob Storage
   * @param blobUrl - The URL of the blob to delete
   */
  async deleteFile(blobUrl: string): Promise<void> {
    try {
      // Extract container name and blob name from URL
      const url = new URL(blobUrl);
      const pathParts = url.pathname.split('/');
      const containerName = pathParts[1];
      const blobName = pathParts.slice(2).join('/');
      
      if (!containerName || !blobName) {
        throw new Error('Invalid blob URL format');
      }
      
      const containerClient = this.blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      await blockBlobClient.deleteIfExists();
    } catch (error) {
      console.error('Error deleting file from Azure Blob Storage:', error);
      throw new Error('Failed to delete file from Azure Blob Storage');
    }
  }
}

/**
 * Azure Document Intelligence service for parsing documents
 */
export class AzureDocumentService {
  private documentAnalysisClient: DocumentAnalysisClient;

  constructor() {
    const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
    const apiKey = process.env.AZURE_FORM_RECOGNIZER_API_KEY;
    
    if (!endpoint || !apiKey) {
      throw new Error('AZURE_FORM_RECOGNIZER_ENDPOINT and AZURE_FORM_RECOGNIZER_API_KEY environment variables are required');
    }
    
    this.documentAnalysisClient = new DocumentAnalysisClient(endpoint, { apiKey } as any);
  } 

  /**
   * Analyze a document using Azure Document Intelligence
   * @param documentUrl - The URL of the document to analyze
   * @returns Extracted key-value pairs from the document
   */
  async analyzeDocument(documentUrl: string): Promise<Record<string, string>> {
    try {
      const poller = await this.documentAnalysisClient.beginAnalyzeDocumentFromUrl(
        'prebuilt-document',
        documentUrl
      );
      
      const result = await poller.pollUntilDone();
      
      // Extract key-value pairs from the analysis result
      const extractedData: Record<string, string> = {};
      
      if (result.keyValuePairs) {
        for (const pair of result.keyValuePairs) {
          if (pair.key && pair.value) {
            const key = pair.key.content?.trim();
            const value = pair.value.content?.trim();
            if (key && value) {
              extractedData[key] = value;
            }
          }
        }
      }
      
      return extractedData;
    } catch (error) {
      console.error('Error analyzing document with Azure Document Intelligence:', error);
      throw new Error('Failed to analyze document with Azure Document Intelligence');
    }
  }
}

// Export singleton instances 
export const azureBlobService = new AzureBlobService();
export const azureDocumentService = new AzureDocumentService();
