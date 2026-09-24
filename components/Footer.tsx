import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';
export default function Footer() {
    return (<footer className="bg-navy-900 text-navy-200 pt-12 pb-8">
      <></>
    
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
          {/* Newsletter compact signup */}
          <div className="mb-6">
            <NewsletterSignup compact/>
          </div>
              <a href="https://studiozerohq.com" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors">Powered by AIdam</a>
              {' · '}
              <a href="https://studiozerohq.com" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors">Studio Zero — AI Marketing Operators for Healthcare</a>
            </p>
          </div>
        </footer>);
}
