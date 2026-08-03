'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Building2, Menu, Moon, Search, X, User } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const enabledTasks = SITE_CONFIG.tasks.filter((t) => t.enabled)
  const listingTask = enabledTasks.find((t) => t.key === 'listing')
  const articleTask = enabledTasks.find((t) => t.key === 'article')

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Submit', href: '/create' },
    ...(articleTask ? [{ label: 'Latest', href: articleTask.route }] : []),
    { label: 'Popular Posts', href: `${articleTask?.route || '/article'}?sort=popular` },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex h-[64px] w-full max-w-[1280px] items-center gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="mr-3 flex shrink-0 items-center gap-2">
          <Image src="/favicon.png" alt={SITE_CONFIG.name} width={64} height={64} className="h-[64px] w-[64px] shrink-0 object-contain" />
          <span className="hidden text-[17px] font-bold tracking-tight text-gray-900 sm:block">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                  active ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Business Directory button */}
          {listingTask && (
            <Link
              href={listingTask.route}
              className="hidden items-center gap-1.5 rounded-full border border-blue-600 px-4 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 sm:flex"
            >
              <Building2 className="h-3.5 w-3.5" />
              Business Directory
            </Link>
          )}

          {/* Search */}
          {showSearch ? (
            <form
              action="/search"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5"
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <input
                name="q"
                type="search"
                placeholder="Search…"
                autoFocus
                className="w-32 bg-transparent text-sm outline-none"
              />
              <button type="button" onClick={() => setShowSearch(false)} aria-label="Close search">
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-gray-200 bg-gray-100 px-1 py-0.5 text-[10px] font-mono leading-none sm:inline">
                Ctrl K
              </kbd>
            </button>
          )}

          {/* Dark mode toggle (UI only) */}
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Toggle dark mode"
          >
            <Moon className="h-5 w-5" />
          </button>

          {/* User / auth */}
          {session ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Logout"
            >
              <User className="h-5 w-5" />
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Login"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <form
            action="/search"
            className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input name="q" type="search" placeholder="Search…" className="flex-1 bg-transparent text-sm outline-none" />
          </form>
          <div className="grid gap-0.5">
            {[
              ...navLinks,
              ...(listingTask ? [{ label: 'Business Directory', href: listingTask.route }] : []),
              ...(session ? [] : [{ label: 'Login', href: '/login' }]),
            ].map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded px-3 py-2.5 text-sm font-medium ${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session && (
              <button
                type="button"
                onClick={() => { logout(); setOpen(false) }}
                className="rounded px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
