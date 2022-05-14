import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArticlePage from './components/pages/ArticlePage/ArticlePage';
import HistoryPage from './components/pages/HistoryPage/HistoryPage';
import HomePage from './components/pages/HomePage/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="post/:postID" element={<ArticlePage />} />
        <Route path="history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
