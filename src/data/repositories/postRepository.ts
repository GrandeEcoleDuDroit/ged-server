import OracleApi from '@api/oracleApi';
import Post from '@models/post';
import PostField from '@fields/postField';

const oracleApi = OracleApi.instance;

export default class PostRepository {
    async createPost(post: Post) {
        const query = `
            INSERT INTO ${PostField.TABLE_NAME} (
                ${PostField.POST_ID},
                ${PostField.POST_TITLE},
                ${PostField.POST_CONTENT},
                ${PostField.POST_LINK},
                ${PostField.POST_SOURCE_ID},
                ${PostField.POST_DATE},
                ${PostField.POST_IMAGE_FILE_NAMES},
                ${PostField.POST_TEST}
            ) VALUES (
                :post_id,
                :post_title,
                :post_content,
                :post_link,
                :post_source_id,
                :post_date,
                :post_image_file_names,
                :post_test
             )
        `;

        const binds = {
            post_id: post.id,
            post_title: post.title,
            post_content: post.content,
            post_link: post.link,
            post_source_id: post.sourceId,
            post_date: post.date,
            post_image_file_names: post.imageFileNames,
            post_test: post.test ? 1 : 0
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }
}