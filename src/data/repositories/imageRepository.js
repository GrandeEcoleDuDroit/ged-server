
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
        const request = {
            namespaceName: namespaceName,
            bucketName: bucketName,
            objectName: objectName
        };

        return await client.getObject(request);
    }

    async deleteImage(objectName) {
        const request = {
            namespaceName: namespaceName,
            bucketName: bucketName,
            objectName: objectName
        };

        return await client.deleteObject(request);
    }

    async uploadImage(filePath, objectName){
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
}

module.exports = ImageRepository;
