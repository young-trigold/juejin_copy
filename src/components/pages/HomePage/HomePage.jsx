/* eslint-disable operator-linebreak */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles, getCategories } from '../../../fake-api';
import styles from './HomePage.module.css';

const { log } = console;

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [activeCategoryID, setActiveCategoryID] = useState(0);
  const [sortBy, setSortBy] = useState('hot');
  const [offsetNum, setOffsetNum] = useState(1);

  const mainRef = useRef(null);

  const naigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const dataCategories = await getCategories();
      setCategories(dataCategories.data.categories);
      setActiveCategoryID(dataCategories.data.categories[0].category_id);
    };

    try {
      fetchData();
      setLoading(true);
    } catch (error) {
      log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const updateArticles = async () => {
      const dataArticles = await getArticles(activeCategoryID, sortBy, offsetNum * 10);
      setArticles([...articles, ...dataArticles.data.articles]);
    };

    updateArticles();
  }, [activeCategoryID, sortBy, offsetNum]);

  // 无限滚动
  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        document.documentElement.scrollTop + window.innerHeight + 50 >=
        document.documentElement.offsetHeight;
      if (atBottom) {
        setOffsetNum(offsetNum + 1);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return 'loading';

  return (
    <div className={styles.HomePage}>
      <header className={styles.TabHeader}>
        <nav className={styles.Tabs}>
          {categories.map((category, i) => (
            <button
              className={styles.Tab}
              type="button"
              key={category.category_id}
              onClick={() => {
                setTabIndex(i);
                setActiveCategoryID(category.category_id);
              }}
            >
              {category.category_name}
            </button>
          ))}
        </nav>

        <nav className={styles.SubTabs}>
          {categories[tabIndex]?.children?.map((subCategory) => (
            <button
              className={styles.SubTab}
              type="button"
              key={subCategory.category_id}
              onClick={() => setActiveCategoryID(subCategory.category_id)}
            >
              {subCategory.category_name}
            </button>
          ))}
        </nav>
      </header>
      <main ref={mainRef}>
        {articles.map((article) => (
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
      </main>
      <footer className={styles.Footer}>
        <button className={styles.Tab} type="button" onClick={() => setSortBy('hot')}>
          热门
        </button>
        <button className={styles.Tab} type="button" onClick={() => setSortBy('new')}>
          最新
        </button>
        <button className={styles.Tab} type="button" onClick={() => naigate('history')}>
          历史
        </button>
      </footer>
    </div>
  );
}

export default HomePage;
