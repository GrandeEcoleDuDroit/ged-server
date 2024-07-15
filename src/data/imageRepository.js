const oci = require('oci-sdk');
const provider = new oci.common.ConfigFileAuthenticationDetailsProvider();
const namespaceName = "ax5bfuffglob"
const bucketName = "bucket-gedoise"
const client = new oci.objectstorage.ObjectStorageClient({
    authenticationDetailsProvider: provider
});

class ImageRepository {
    async listObjects(){
        try {
            const request = {
                namespaceName: namespaceName,
                bucketName: bucketName
            };

            const response = await client.listObjects(request);
            console.log('Objects in bucket: ', response.listObjects.objects)
        }
        catch (err) {
            console.error('Error listing objects in bucket: ', err);
        }
    }
}

module.exports = ImageRepository;