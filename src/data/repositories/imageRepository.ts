import ociCommon from 'oci-common';
import ociObjectStorage from 'oci-objectstorage';
import {GetObjectRequest, PutObjectRequest} from 'oci-objectstorage/lib/request';
import {Readable} from 'stream';
import { OBJECT_STORAGE_NAMESPACE, OBJECT_STORAGE_BUCKET_NAME } from '@root/src/env';

const provider = new ociCommon.ConfigFileAuthenticationDetailsProvider();

const client = new ociObjectStorage.ObjectStorageClient({
    authenticationDetailsProvider: provider
});

export default class ImageRepository {
    async deleteImage(imagePath: string) {
        const request = {
            namespaceName: OBJECT_STORAGE_NAMESPACE,
            bucketName: OBJECT_STORAGE_BUCKET_NAME,
            objectName: imagePath
        };

        return await client.deleteObject(request as GetObjectRequest);
    }

    async uploadImage(fileStream: Readable, imagePath: string, contentLength: number) {
        const request = {
            namespaceName: OBJECT_STORAGE_NAMESPACE,
            bucketName: OBJECT_STORAGE_BUCKET_NAME,
            objectName: imagePath,
            putObjectBody: fileStream,
            contentLength: contentLength
        };

        return await client.putObject(request as PutObjectRequest);
    }
}
