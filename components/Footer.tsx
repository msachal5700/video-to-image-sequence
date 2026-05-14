import { memo } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          <div>
            <div className="flex items-center gap-2 font-bold text-white mb-3 font-display">
              <span className="text-cyan-400">▶</span> Video to Image Sequence Online
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Free browser-based video frame extractor. Convert any video to JPG/PNG
              image sequences instantly — no upload, no limits, completely private.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Features</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              {['Custom FPS Control','ZIP Download','Batch Processing',
                'JPG & PNG Output','Individual Frame Download'].map(f => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="text-gray-600 hover:text-cyan-400 transition">Blog & Guides</Link></li>
              <li><Link to="/#how-it-works" className="text-gray-600 hover:text-cyan-400 transition">How It Works</Link></li>
              <li><Link to="/#faq" className="text-gray-600 hover:text-cyan-400 transition">FAQ</Link></li>
              <li><Link to="/#compare" className="text-gray-600 hover:text-cyan-400 transition">Tool Comparison</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row
          justify-between items-center gap-4 text-xs text-gray-700">
          <p>© {new Date().getFullYear()} Video to Image Sequence Online · Free forever</p>
          <p>Processing is 100% local · Your videos never leave your device</p>
        </div>
      </div>


      <div className="text-center mt-6 pb-4">
  <a 
    href="https://www.toolpilot.ai" 
    target="_blank" 
    rel="noopener"
    className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-400 transition"
  >
    <img 
      src="https://www.toolpilot.ai/cdn/shop/files/f-w_690x151_crop_center.png?v=1695883028" 
      alt="Featured on Toolpilot" 
      className="h-6 opacity-50 hover:opacity-80 transition"
    />
    Featured on Toolpilot
  </a>
</div>

      
    </footer>
  );
};
export default memo(Footer);
