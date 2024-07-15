const oci = require('oci-sdk');
const provider = oci.common.ConfigFileAuthenticationDetailsProvider;
const namespace = "ax5bfuffglob"
const bucketName = "bucket-gedoise"
const client = new oci.objectstorage.ObjectStorageClient({
    authenticationDetailsProvider: provider
});

class ImageRepository {
    async listObjects(){
        try {
            const request = {
                namespace: namespace,
                bucketName: bucketName
            };

            const response = await client.listObjects(request);
            console.log('Objects in bucket: ', response.listObjects)
        }
        catch (err) {
            console.error('Error listing objects in bucket: ', err);
        }
    }
}

module.exports = ImageRepository;