import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-dark-900 text-cream-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 text-cream-100">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2C10.9 2 10 2.9 10 4v1.2C8.8 5.7 8 6.8 8 8.1V10c0 1.3.8 2.4 2 2.9V22h4v-9.1c1.2-.5 2-1.6 2-2.9V8.1c0-1.3-.8-2.4-2-2.9V4c0-1.1-.9-2-2-2z"/>
                  <path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  <path d="M8 16h8v2H8z"/>
                  <path d="M7 18h10v1H7z"/>
                </svg>
              </div>
              <span className="text-xl font-bold">Kabir Sant Sharan</span>
            </div>
            <p className="text-cream-200 text-sm leading-relaxed mb-4">
              A sacred space dedicated to sharing the timeless wisdom and divine teachings of Sant Kabir Das.
              Join our spiritual community in exploring the path of truth, love, and devotion.
            </p>
            <div className="text-cream-300 text-sm italic">
              &ldquo;सत्य का मार्ग सबसे कठिन है, परंतु सबसे सुंदर भी।&rdquo; <br />
              - Sant Kabir Das
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-cream-100 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={"/media"} className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Media
                </Link>
              </li>
              <li>
                <Link href={"/teachings"} className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Teachings
                </Link>
              </li>
              <li>
                <Link href={"/events"} className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Events
                </Link>
              </li>
              <li>
                <Link href={"/media"} className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Media
                </Link>
              </li>
              <li>
                <Link href={"/events"} className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Community Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Connect */}
          <div>
            <h3 className="font-semibold text-cream-100 mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@kabirsantsharan.org" className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href={"/events"} className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Join Satsang
                </Link>
              </li>
              <li>
                <Link href={"/teachings"} className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Community Forum
                </Link>
              </li>
              <li>
                <a href="mailto:contact@kabirsantsharan.org" className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-dark-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-cream-300 text-sm mb-4 md:mb-0">
            © 2024 Kabir Sant Sharan. All rights reserved. | Built with devotion and technology.
          </div>
          <div className="flex space-x-6 text-sm">
            <span className="text-cream-300">Privacy Policy</span>
            <span className="text-cream-300">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}