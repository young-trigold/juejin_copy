import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticleById } from '../../../fake-api';
import styles from './HistoryPage.module.css';

const { log } = console;

function HistoryPage() {
  const [articlesRead, setArticlesRead] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const articleReadIds = [...new Set(localStorage.getItem('articleReadIds').split(','))];

    const fetchArticles = () => {
      const dataArticles = [];

      articleReadIds.forEach(async (articleId) => {
        const dataArticle = await getArticleById(articleId);

        dataArticles.push(dataArticle.data.article);
      });

      setArticlesRead(dataArticles);
    };

    try {
      setLoading(true);
      fetchArticles();
    } catch (error) {
      log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return loading ? (
    'loading'
  ) : (
    <div>
      {articlesRead.map((article) => (
        <article className={styles.Article} key={article.article_id}>
          <div className={styles.AuthorInfoBar}>
            <div>{article.author_user_info.user_name}</div>
            <time>{new Date().toLocaleDateString()}</time>
            <div>{`${article.category_info.first_category_name} | ${article.category_info.second_category_name}`}</div>
          </div>
          <div className={styles.ArticleInfo}>
            <h3 className={styles.ArticleTitle}>
              <Link to={`/post/${article.article_id}`}>{article.article_info.title}</Link>
            </h3>
            <section style={{ padding: '0 1em', color: '#71777c' }}>
              {article.article_info.brief_content}
            </section>
          </div>
          <div className={styles.InteractInfoBar}>
            <div>{`浏览: ${article.article_info.view_count}`}</div>
            <div>{`点赞: ${article.article_info.digg_count}`}</div>
            <div>{`评论: ${article.article_info.comment_count}`}</div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default HistoryPage;
