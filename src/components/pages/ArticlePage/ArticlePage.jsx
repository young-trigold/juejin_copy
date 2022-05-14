import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById, getCommentsByArticleId } from '../../../fake-api';
import styles from './ArticlePage.module.css';

const { log } = console;

function ArticlePage() {
  const [article, setArticle] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { postID } = useParams();

  // 记录已浏览文章 id
  localStorage.setItem(
    'articleReadIds',
    localStorage.getItem('articleReadIds')
      ? postID.concat(`,${localStorage.getItem('articleReadIds')}`)
      : postID,
  );

  useEffect(() => {
    const fetchArticle = async () => {
      const dataArticle = await getArticleById(postID);
      setArticle(dataArticle.data.article);
    };

    try {
      setLoading(true);
      fetchArticle();
    } catch (error) {
      log(error);
    } finally {
      setLoading(false);
    }
  }, [postID]);

  useEffect(() => {
    const fetchComments = async () => {
      const dataComments = await getCommentsByArticleId(postID);
      setComments(dataComments.data.comments);
    };

    try {
      setLoading(true);
      fetchComments();
    } catch (error) {
      log(error);
    } finally {
      setLoading(false);
    }
  }, [postID]);

  if (loading) return 'loading';

  return (
    <div className={styles.ArticlePage}>
      <header className={styles.AuthorInfoBar}>
        <img width={50} src={article?.author_user_info?.avatar_large} alt="作者头像" />
        <div className={styles.UserName}>
          <div>{`${article?.author_user_info?.user_name}--${article?.author_user_info?.company}`}</div>
          <div>{article?.author_user_info?.description}</div>
        </div>
      </header>
      <main className={styles.Main}>
        <img src={article?.article_info?.cover_image} alt="文章配图" />
        <h2>{article?.article_info?.title}</h2>
        <section dangerouslySetInnerHTML={{ __html: article?.article_content }} />
        <section className={styles.Comments}>
          {comments.map((comment) => (
            <div key={comment.comment_id}>
              <header className={styles.AuthorInfoBar}>
                <img width={50} src={comment?.user_info?.avatar_large} alt="作者头像" />
                <div className={styles.UserName}>
                  <div>{`${comment?.user_info?.user_name}--${comment?.user_info?.company}`}</div>
                  <div>{comment?.comment_info?.comment_content}</div>
                </div>
              </header>
              <section style={{ padding: '1em 3em' }}>
                {comment?.reply_infos?.map((reply) => (
                  <div key={reply?.reply_id} className={styles.AuthorInfoBar}>
                    <img width={50} src={reply?.user_info?.avatar_large} alt="作者头像" />
                    <div className={styles.UserName}>
                      <div>{`${reply?.user_info?.user_name}--${reply?.user_info?.company}`}</div>
                      <div>{reply.reply_info.reply_content}</div>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default ArticlePage;
