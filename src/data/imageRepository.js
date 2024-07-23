const oci = require('oci-sdk');
const fs = require('fs');
const provider = new oci.common.ConfigFileAuthenticationDetailsProvider();
const namespaceName = "ax5bfuffglob";
const bucketName = "bucket-gedoise";
const client = new oci.objectstorage.ObjectStorageClient({
    authenticationDetailsProvider: provider
});

class ImageRepository {

    async downloadImage(objectName){
        const request = {
            namespaceName: namespaceName,
            bucketName: bucketName,
            objectName: objectName
        }

        return await client.getObject(request);
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
            }

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