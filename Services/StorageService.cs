using Azure.Storage.Blobs;

namespace Reviews.Services;

public class StorageService
{
    private readonly BlobContainerClient _containerClient;
    public StorageService(IConfiguration configuration)
    {
        string connectionString = configuration.GetConnectionString("AzureStorage")
            ?? throw new InvalidOperationException("String 'AzureContainer' not found.");
        string blobContainerName = configuration.GetValue<string>("AzureContainer")
            ?? throw new InvalidOperationException("String 'AzureContainer' not found.");
        _containerClient = new BlobContainerClient(connectionString, blobContainerName);
    }

    public async Task<Uri> Upload(IFormFile file)
    {
        BlobClient blobClient = _containerClient
            .GetBlobClient($"{Guid.NewGuid().ToString()}-{file.FileName}");
        using Stream fileStream = file.OpenReadStream();
        await blobClient.UploadAsync(fileStream);
        return blobClient.Uri;
    }
}