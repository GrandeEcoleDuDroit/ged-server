import ociCommon from 'oci-common';
import ociObjectStorage from 'oci-objectstorage';
import {GetObjectRequest, PutObjectRequest} from "oci-objectstorage/lib/request";
import {Readable} from "stream";

const provider = new ociCommon.ConfigFileAuthenticationDetailsProvider();
const namespaceName = process.env.OBJECT_STORAGE_NAMESPACE;
const bucketName = process.env.OBJECT_STORAGE_BUCKET_NAME;
const client = new ociObjectStorage.ObjectStorageClient({
    authenticationDetailsProvider: provider
});

export default class ImageRepository {
    async downloadImage(fileName: string){
        const request = {
            namespaceName: namespaceName,
            bucketName: bucketName,
            objectName: fileName
        };

        return await client.getObject(request as GetObjectRequest);
    }

    async deleteImage(fileName: string) {
        const request = {
            namespaceName: namespaceName,
            bucketName: bucketName,
            objectName: fileName
        };

        return await client.deleteObject(request as GetObjectRequest);
    }

    async uploadImage(fileStream: Readable, fileName: string, contentLength: number) {
        const request = {
            namespaceName: namespaceName,
            bucketName: bucketName,
            objectName: fileName,
            putObjectBody: fileStream,
            contentLength: contentLength
        };

        return await client.putObject(request as PutObjectRequest);
    }
}
