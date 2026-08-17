'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const LOGO_IMG = <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 shrink-0 object-contain" />

function TwitterX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Submit', href: '/create' },
    { label: 'FAQ', href: '/contact' },
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {LOGO_IMG}
            <span className="text-xl font-bold text-gray-900">{SITE_CONFIG.name}</span>
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-sm text-gray-600 transition hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <button
                type="button"
                onClick={logout}
                className="text-sm text-gray-600 transition hover:text-gray-900"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-3 text-gray-500 shrink-0">
            <a href="#" aria-label="X (Twitter)" className="transition hover:text-gray-900">
              <TwitterX />
            </a>
            <a href="#" aria-label="Facebook" className="transition hover:text-gray-900">
              <FacebookIcon />
            </a>
            <a href="#" aria-label="LinkedIn" className="transition hover:text-gray-900">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
        © 2009–{year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
