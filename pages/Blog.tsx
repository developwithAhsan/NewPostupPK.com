import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import Head from '../components/Head';
import { Clock, User, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { ShareButtons, Newsletter } from '../components/Features';

// Component for listing all blog posts
const BlogIndex: React.FC = () => (
  <div className="container mx-auto px-4 py-12">
    <Head 
      title="Blog - PostupPK Insights" 
      description="Tips, tutorials, and updates from the PostupPK team. Learn how to optimize your PDF and digital workflows." 
      keywords="pdf blog, digital tools tutorial, productivity tips, postuppk news"
    />
    
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Our Blog</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300">Insights, tutorials, and productivity tips.</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {BLOG_POSTS.map(post => (
        <article key={post.id} className="flex flex-col bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <Link to={`/blog/${post.slug}`} className="block overflow-hidden h-48">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </Link>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex gap-2 mb-3">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <Link to={`/blog/${post.slug}`} className="block mb-3">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h2>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="flex items-center gap-1">
                <Calendar size={14} /> {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} /> {post.readTime}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
    
    <div className="mt-20">
      <Newsletter />
    </div>
  </div>
);

// Component for a single blog post
const BlogPostView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Article Not Found</h1>
        <Link to="/blog" className="text-primary-600 hover:underline">Return to Blog</Link>
      </div>
    );
  }

  // Schema for Article
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "datePublished": post.date, // Note: Should ideally be ISO format
    "author": {
      "@type": "Person",
      "name": post.author
    }
  };

  return (
    <article className="pb-20">
      <Head 
        title={post.title} 
        description={post.excerpt} 
        image={post.image}
        type="article"
        author={post.author}
        schema={schema}
      />
      
      {/* Article Header */}
      <div className="bg-gray-50 dark:bg-dark-900/50 py-12 md:py-20 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" /> Back to Blog
          </Link>
          
          <div className="flex justify-center gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <User size={16} /> <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} /> <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 max-w-3xl -mt-10">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-[400px] object-cover rounded-2xl shadow-2xl mb-12"
        />
        
        <div 
          className="prose prose-lg dark:prose-invert max-w-none prose-a:text-primary-600 prose-headings:text-gray-900 dark:prose-headings:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <hr className="my-12 border-gray-200 dark:border-gray-800" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 dark:bg-dark-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
           <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Enjoyed this article?</h4>
              <p className="text-sm text-gray-500">Share it with your friends and colleagues.</p>
           </div>
           <div className="-mt-6 md:mt-0">
             <ShareButtons url={`https://postuppk.com/blog/${post.slug}`} title={post.title} />
           </div>
        </div>
      </div>
    </article>
  );
};

export const Blog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return slug ? <BlogPostView /> : <BlogIndex />;
};

export default Blog;