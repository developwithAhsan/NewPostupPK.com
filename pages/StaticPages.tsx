import React from 'react';
import { Link } from 'react-router-dom';
import Head from '../components/Head';
import { NAV_LINKS, TOOLS, BLOG_POSTS } from '../constants';
import { Mail, MapPin, Check } from 'lucide-react';

const PageLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const description = `${title} - PostupPK.com. Learn more about our free online utility tools, privacy policy, and terms of service.`;
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[60vh]">
      <Head title={title} description={description} />
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white border-b pb-4 dark:border-gray-700">{title}</h1>
      <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
};

export const About: React.FC = () => (
  <PageLayout title="About Us">
    <p className="lead text-xl">Welcome to PostupPK.com. We are dedicated to providing the best free online utility tools to make your digital life easier.</p>
    
    <h3>Our Mission</h3>
    <p>To provide fast, secure, and free tools accessible to everyone, everywhere. We believe productivity shouldn't come with a price tag or privacy risks.</p>
    
    <h3>Why Choose Us?</h3>
    <ul>
      <li><strong>Client-Side Processing:</strong> Your files never leave your browser.</li>
      <li><strong>100% Free:</strong> No hidden costs or premium subscriptions.</li>
      <li><strong>Responsive:</strong> Works on phones, tablets, and desktops.</li>
    </ul>
  </PageLayout>
);

export const Contact: React.FC = () => {
  return (
    <PageLayout title="Contact Us">
      <p>Have questions? Suggestions? Found a bug?</p>
      
      <div className="flex gap-6 mb-8 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
            <Mail size={20} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-gray-500">Email</div>
            <a href="mailto:editingking.2977@gmail.com" className="font-semibold hover:text-primary-600">editingking.2977@gmail.com</a>
          </div>
        </div>
      </div>

      <form 
        action="https://formsubmit.click/postuppk.com@gmail.com" 
        method="POST" 
        className="mt-8 space-y-6 bg-gray-50 dark:bg-dark-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <input type="hidden" name="_subject" value="New Contact Form Submission - PostupPK" />
        <input type="hidden" name="_captcha" value="false" />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input type="text" name="name" required className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-900 dark:border-gray-600 p-3 border outline-none transition-colors" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" name="email" required className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-900 dark:border-gray-600 p-3 border outline-none transition-colors" placeholder="john@example.com" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
          <select name="subject" className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-900 dark:border-gray-600 p-3 border outline-none transition-colors">
            <option value="General Inquiry">General Inquiry</option>
            <option value="Report a Bug">Report a Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Partnership">Partnership</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
          <textarea name="message" required rows={5} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-900 dark:border-gray-600 p-3 border outline-none transition-colors" placeholder="How can we help you?"></textarea>
        </div>
        
        <button type="submit" className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30">Send Message</button>
      </form>
    </PageLayout>
  );
};

export const Terms: React.FC = () => (
  <PageLayout title="Terms of Service & User Agreement">
    <p className="text-sm text-gray-500 mb-6 italic">Last Updated: November 2024</p>
    
    <p className="lead text-lg">
      Welcome to <strong>PostupPK.com</strong>. By accessing our website and using our free online PDF and utility tools, you agree to comply with and be bound by the following terms and conditions of use.
    </p>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">1. Acceptance of Terms</h2>
    <p>
      By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
    </p>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">2. How Our Service Works</h2>
    <p>
      PostupPK.com provides free online tools for PDF manipulation, image conversion, and data calculation. 
    </p>
    <ul className="list-disc pl-6 space-y-2 mt-4">
      <li><strong>Client-Side Processing:</strong> We utilize advanced WebAssembly technology to process files directly in your web browser.</li>
      <li><strong>No Server Uploads:</strong> Unlike other services, your files are <strong>not</strong> uploaded to our servers for processing (except for specific API-based tools like QR Generation which are clearly marked).</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">3. User Responsibilities</h2>
    <p>
      When using our service, you agree to:
    </p>
    <ul className="list-disc pl-6 space-y-2 mt-4">
      <li>Not use our tools for any illegal purposes or to process illegal content.</li>
      <li>Not attempt to reverse engineer or overload our systems.</li>
      <li>Take full responsibility for the data and files you process using our tools.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">4. Disclaimer of Warranties</h2>
    <p>
      The materials on PostupPK.com are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
    </p>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">5. Limitation of Liability</h2>
    <p>
      In no event shall PostupPK or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we have been notified orally or in writing of the possibility of such damage.
    </p>
  </PageLayout>
);

export const Privacy: React.FC = () => (
  <PageLayout title="Privacy Policy">
    <p className="text-sm text-gray-500 mb-6 italic">Last Updated: November 2024</p>
    
    <p className="lead text-lg">
      At <strong>PostupPK.com</strong>, your privacy isn't just a policy—it's the core of our architecture. We understand that you trust us with your sensitive documents, and we take that responsibility seriously.
    </p>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">The "No-Upload" Promise</h2>
    <p>
      This is the most important part of our privacy policy: <strong>We do not see your files.</strong>
    </p>
    <p>
      For the vast majority of our tools (including Merge PDF, Split PDF, Image Converter, Password Generator), the processing happens <strong>locally on your device</strong>. 
    </p>
    <ul className="list-disc pl-6 space-y-2 mt-4">
      <li>When you "upload" a file, it simply moves into your browser's memory.</li>
      <li>It is processed by your computer's CPU.</li>
      <li>The result is saved back to your computer.</li>
      <li>The file never travels over the internet to our servers.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">Information We Collect</h2>
    <p>
      Since we don't require registration, we collect very little information about you.
    </p>
    <h3 className="text-xl font-bold mt-4 mb-2">1. Usage Data (Anonymous)</h3>
    <p>
      We may use standard analytics tools (like Google Analytics) to understand how people use our website. This data helps us fix bugs and improve user experience. It includes things like:
    </p>
    <ul className="list-disc pl-6 space-y-2 mt-2">
      <li>Which pages you visit.</li>
      <li>What type of device/browser you are using.</li>
      <li>Country of origin (for language support).</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">2. Local Storage</h3>
    <p>
      We use your browser's "Local Storage" to remember your preferences, such as:
    </p>
    <ul className="list-disc pl-6 space-y-2 mt-2">
      <li>Dark Mode vs. Light Mode settings.</li>
      <li>Whether you have accepted our cookie notice.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">Advertising and Third Parties</h2>
    <p>
      To keep this service free, we may display advertisements from third-party networks (like Google AdSense). These advertisers may use cookies to serve ads based on your prior visits to our website or other websites.
    </p>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">Contact Us</h2>
    <p>
      If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact@postuppk.com" className="text-primary-600 hover:underline">contact@postuppk.com</a>.
    </p>
  </PageLayout>
);

export const Disclaimer: React.FC = () => (
  <PageLayout title="Disclaimer">
    <p>The tools provided on this website are for informational and utility purposes only.</p>
    <p>While we strive for accuracy, PostupPK.com cannot guarantee the results of file conversions or processing. Always keep a backup of your original files.</p>
  </PageLayout>
);

export const FAQs: React.FC = () => (
  <PageLayout title="Frequently Asked Questions">
    <div className="space-y-4">
      <details className="group bg-gray-50 dark:bg-dark-800 rounded-lg open:ring-2 open:ring-primary-100 dark:open:ring-primary-900/20">
        <summary className="font-bold cursor-pointer p-4 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg flex justify-between items-center select-none">
           Is this service free?
           <span className="text-xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 mt-2">
           Yes, PostupPK.com is 100% free to use. There are no hidden fees or subscriptions required.
        </div>
      </details>
      <details className="group bg-gray-50 dark:bg-dark-800 rounded-lg open:ring-2 open:ring-primary-100 dark:open:ring-primary-900/20">
        <summary className="font-bold cursor-pointer p-4 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg flex justify-between items-center select-none">
           Are my files safe?
           <span className="text-xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 mt-2">
           Yes. We process files on your device using client-side technology. They don't leave your computer to go to a server, ensuring maximum privacy.
        </div>
      </details>
      <details className="group bg-gray-50 dark:bg-dark-800 rounded-lg open:ring-2 open:ring-primary-100 dark:open:ring-primary-900/20">
        <summary className="font-bold cursor-pointer p-4 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg flex justify-between items-center select-none">
           Do I need to install anything?
           <span className="text-xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 mt-2">
           No. All tools run directly in your web browser (Chrome, Firefox, Safari, Edge).
        </div>
      </details>
    </div>
  </PageLayout>
);

export const Sitemap: React.FC = () => (
  <PageLayout title="Sitemap">
    <div className="grid md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-bold text-lg mb-4 text-primary-600">Pages</h3>
        <ul className="space-y-2">
          {NAV_LINKS.map(link => (
            <li key={link.path}>
               <Link to={link.path} className="hover:underline">{link.name}</Link>
            </li>
          ))}
          <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
          <li><Link to="/disclaimer" className="hover:underline">Disclaimer</Link></li>
          <li><Link to="/faqs" className="hover:underline">FAQs</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-4 text-primary-600">Tools</h3>
        <ul className="space-y-2">
          {TOOLS.map(tool => (
            <li key={tool.id}>
              <Link to={tool.path} className="hover:underline">{tool.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-4 text-primary-600">Latest Articles</h3>
        <ul className="space-y-2">
          {BLOG_POSTS.map(post => (
            <li key={post.id}>
              <Link to={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </PageLayout>
);