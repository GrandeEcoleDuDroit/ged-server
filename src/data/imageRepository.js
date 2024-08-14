const ociCommon = require('oci-common');
const ociObjectStorage = require('oci-objectstorage');
const fs = require('fs');
const provider = new ociCommon.ConfigFileAuthenticationDetailsProvider();
const namespaceName = "ax5bfuffglob";
const bucketName = "bucket-gedoise";
const client = new ociObjectStorage.ObjectStorageClient({
    authenticationDetailsProvider: provider
});

class ImageRepository {

    async downloadImage(objectName){
        try {
            const request = {
                namespaceName: namespaceName,
                bucketName: bucketName,
                objectName: objectName
            };

            return await client.getObject(request);
        }
        catch (error) {
            console.error(`Error getting image ${objectName}: ${error}`);
            throw error;
        }
    }

    async deleteImage(objectName) {
        try {
            const request = {
                namespaceName: namespaceName,
                bucketName: bucketName,
                objectName: objectName
            };

            return await client.deleteObject(request);
        }
        catch (error) {
            console.error(`Error deleting image ${objectName}`, error);
            throw error;
        }
    }

    async uploadImage(filePath, objectName){
        try {
            const fileStream = fs.createReadStream(filePath);
            const fileStats = fs.statSync(filePath);

            const request = {
                namespaceName: namespaceName,
                bucketName: bucketName,
                objectName: objectName,
                putObjectBody: fileStream,
                contentLength: fileStats.size
            };

            const response = await client.putObject(request);
            fs.unlinkSync(filePath);
            return response;
        }
        catch (error) {
            console.error(`Error uploading image ${objectName}:`, error);
            throw error;
        }
    }
}

module.exports = ImageRepository;
