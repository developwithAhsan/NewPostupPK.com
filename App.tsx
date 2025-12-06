import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for performance (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const ToolView = lazy(() => import('./pages/ToolView'));
const Blog = lazy(() => import('./pages/Blog'));
const ToolsCategory = lazy(() => import('./pages/ToolsCategory'));

// Static pages grouping
const About = lazy(() => import('./pages/StaticPages').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/StaticPages').then(module => ({ default: module.Contact })));
const Terms = lazy(() => import('./pages/StaticPages').then(module => ({ default: module.Terms })));
const Privacy = lazy(() => import('./pages/StaticPages').then(module => ({ default: module.Privacy })));
const Disclaimer = lazy(() => import('./pages/StaticPages').then(module => ({ default: module.Disclaimer })));
const FAQs = lazy(() => import('./pages/StaticPages').then(module => ({ default: module.FAQs })));
const Sitemap = lazy(() => import('./pages/StaticPages').then(module => ({ default: module.Sitemap })));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tools/:category" element={<ToolsCategory />} />
              <Route path="tool/:toolId" element={<ToolView />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<Blog />} />
              
              {/* Static Pages */}
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="disclaimer" element={<Disclaimer />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="sitemap" element={<Sitemap />} />
              
              {/* 404 Fallback */}
              <Route path="*" element={
                <div className="container mx-auto py-20 px-4 text-center dark:text-white">
                  <h1 className="text-6xl font-bold mb-4 text-primary-600">404</h1>
                  <p className="text-xl mb-8">Page Not Found</p>
                  <Link to="/" className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition-colors">Go Home</Link>
                </div>
              } />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;