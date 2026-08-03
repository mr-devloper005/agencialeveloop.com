import Link from 'next/link'
import { BookOpen, Check, Clock3, Eye, Heart, MessageCircle, Users } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function getExcerpt(post: SitePost | null | undefined, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post: SitePost | null | undefined) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function hashStr(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function stableViewCount(post: SitePost) {
  return 1 + (hashStr((post.slug || post.title || 'x') + 'v') % 299)
}

function readTime(post: SitePost) {
  const words = getExcerpt(post, 10000).split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function formatTimeAgo(dateStr?: string | null) {
  if (!dateStr) return '2 months ago'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days < 1) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months === 1) return '1 month ago'
  if (months < 12) return `${months} months ago`
  const years = Math.floor(months / 12)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

const CATEGORY_COLORS: Record<string, string> = {
  technology: 'bg-pink-500',
  tech: 'bg-pink-500',
  software: 'bg-purple-500',
  business: 'bg-orange-500',
  health: 'bg-blue-500',
  'health & fitness': 'bg-blue-500',
  fitness: 'bg-blue-500',
  travel: 'bg-purple-600',
  'travel tips': 'bg-purple-600',
  'real estate': 'bg-green-600',
  relationship: 'bg-teal-500',
  'self improvement': 'bg-indigo-500',
  investing: 'bg-emerald-600',
  'link popularity': 'bg-cyan-600',
  pets: 'bg-lime-600',
}
const FALLBACK_COLORS = ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-600', 'bg-orange-500', 'bg-teal-500', 'bg-indigo-500']

function categoryColor(category: string) {
  const key = category.toLowerCase()
  return CATEGORY_COLORS[key] || FALLBACK_COLORS[hashStr(key) % FALLBACK_COLORS.length]
}

const AVATAR_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-indigo-500']

function AuthorAvatar({ name, size = 'md' }: { name: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const initial = (name || 'A').charAt(0).toUpperCase()
  const color = AVATAR_COLORS[hashStr(name || 'A') % AVATAR_COLORS.length]
  const cls = { xs: 'h-5 w-5 text-[10px]', sm: 'h-7 w-7 text-xs', md: 'h-8 w-8 text-sm', lg: 'h-14 w-14 text-xl' }
  return (
    <span className={`${cls[size]} ${color} inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white`}>
      {initial}
    </span>
  )
}

/* ─── Hero: dark background + carousel ───────────────────────────────────── */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const carouselPosts = pool.slice(0, 8)

  return (
    <section className="bg-[#0c0c1a] text-white">
      {/* Text block */}
      <div className="mx-auto max-w-[1280px] px-4 pb-6 pt-12 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          Top Picks
        </span>

        <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Hand{' '}
          <span className="text-purple-400">Picked</span>
        </h1>
        <p className="mt-3 text-base text-white/70 sm:text-lg">
          Hand-selected quality content you shouldn&apos;t miss
        </p>
        <p className="mt-1 text-sm text-white/45">
          Get discovered. Make an impact. Join the creators shaping conversations that matter.
        </p>

        {/* Category pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['All Categories', 'Self Improvement', 'Technology', 'Investing', 'Business'].map((cat, i) => (
            <Link
              key={cat}
              href={i === 0 ? primaryRoute : `${primaryRoute}?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                i === 0
                  ? 'border border-white/25 text-white hover:bg-white/10'
                  : `text-white ${
                      ['from-purple-600 to-violet-600', 'from-pink-600 to-rose-500', 'from-emerald-600 to-green-500', 'from-orange-500 to-amber-500'][i - 1]
                    } bg-gradient-to-r`
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/create"
            className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Start Writing
          </Link>
          <Link
            href={primaryRoute}
            className="rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/20"
          >
            Explore Content
          </Link>
        </div>
      </div>

      {/* Carousel */}
      <div className="pb-8">
        {carouselPosts.length > 0 ? (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6">
            {carouselPosts.map((post) => {
              const cat = categoryOf(post)
              return (
                <Link
                  key={post.id || post.slug}
                  href={postHref(primaryTask, post, primaryRoute)}
                  className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-gray-800 transition hover:bg-gray-700 sm:w-[360px]"
                >
                  <div className="relative h-[160px] overflow-hidden">
                    <img
                      src={getEditablePostImage(post)}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {cat && (
                      <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${categoryColor(cat)}`}>
                        {cat}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-purple-300">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-white/55">
                      {getExcerpt(post, 80)}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <AuthorAvatar name={post.authorName || 'A'} size="xs" />
                        <span>{post.authorName || 'Author'}</span>
                        <span>·</span>
                        <Eye className="h-3 w-3" />
                        <span>{stableViewCount(post)}</span>
                      </div>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/70 group-hover:bg-white/20">
                        Read Post →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex snap-x gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-gray-800 opacity-40 sm:w-[360px]">
                <div className="h-[160px] bg-gray-700" />
                <div className="p-4">
                  <div className="h-4 w-4/5 rounded bg-gray-600" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`rounded-full ${i === 0 ? 'h-2 w-6 bg-white' : 'h-2 w-2 bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Story Rail (removed) ───────────────────────────────────────────────── */
export function EditableStoryRail(_props: HomeSectionProps) {
  return null
}

/* ─── Editor's Pick + Hot Right Now ─────────────────────────────────────── */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const featured = all[0]
  const hotList = all.slice(1, 9)

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-[1280px] px-4">
        {/* Section heading */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-12 bg-[var(--slot4-accent)]" />
            <h2 className="text-2xl font-extrabold tracking-tight">Editor&apos;s Pick</h2>
            <div className="h-[2px] w-12 bg-[var(--slot4-accent)]" />
          </div>
          <p className="mt-2 text-sm text-gray-500">Outstanding contributions from our authors.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
          {/* Featured card */}
          {featured ? (
            <article className="overflow-hidden rounded-2xl bg-[#111827] text-white">
              <div className="relative h-[280px] overflow-hidden">
                <img
                  src={getEditablePostImage(featured)}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute left-4 top-4 rounded bg-[var(--slot4-accent)] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                  Trending
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/55">
                  <AuthorAvatar name={featured.authorName || 'A'} size="sm" />
                  <span className="font-medium text-white/80">{featured.authorName || 'Author'}</span>
                  <span>·</span>
                  <Clock3 className="h-3.5 w-3.5" />
                  <span>{formatTimeAgo(featured.publishedAt ?? featured.createdAt)}</span>
                  <span>·</span>
                  <span>{readTime(featured)} min read</span>
                </div>
                <Link href={postHref(primaryTask, featured, primaryRoute)}>
                  <h2 className="mt-3 text-2xl font-extrabold leading-tight hover:text-purple-300 transition">
                    {featured.title}
                  </h2>
                </Link>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/55">
                  {getExcerpt(featured, 200)}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-white/45">
                    <span className="flex items-center gap-1"><Heart className="h-4 w-4" />0</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />0</span>
                  </div>
                  <Link
                    href={postHref(primaryTask, featured, primaryRoute)}
                    className="rounded-full bg-[var(--slot4-accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95"
                  >
                    Read Full Story
                  </Link>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-2xl bg-gray-200 h-[420px] animate-pulse" />
          )}

          {/* Hot Right Now */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <h3 className="text-base font-extrabold uppercase tracking-widest text-gray-900">Hot Right Now</h3>
            </div>
            <div className="grid gap-3">
              {hotList.length > 0 ? (
                hotList.map((post, i) => {
                  const cat = categoryOf(post)
                  return (
                    <article key={post.id || post.slug} className="flex gap-4 rounded-xl bg-gray-100 p-4 transition hover:bg-gray-200">
                      <span className="shrink-0 w-8 text-3xl font-extrabold leading-none text-gray-300">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        {cat && (
                          <span className={`mb-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${categoryColor(cat)}`}>
                            {cat}
                          </span>
                        )}
                        <Link href={postHref(primaryTask, post, primaryRoute)}>
                          <h4 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 hover:text-blue-600">
                            {post.title}
                          </h4>
                        </Link>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
                          <AuthorAvatar name={post.authorName || 'A'} size="xs" />
                          <span>{post.authorName || 'Author'}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />0</span>
                        </div>
                      </div>
                    </article>
                  )
                })
              ) : (
                <p className="text-sm text-gray-400">No posts yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Editor Verified card ───────────────────────────────────────────────── */
function VerifiedCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const cat = categoryOf(post)
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img src={image} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
        {cat && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${categoryColor(cat)}`}>
            {cat}
          </span>
        )}
      </div>
      <div className="p-4">
        <Link href={href}>
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900 hover:text-blue-600">
            {post.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{getExcerpt(post, 100)}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AuthorAvatar name={post.authorName || 'A'} size="sm" />
            <span className="font-medium">{post.authorName || 'Author'}</span>
            <span>·</span>
            <span className="text-xs">{formatTimeAgo(post.publishedAt ?? post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-0.5"><Heart className="h-3.5 w-3.5" />0</span>
            <span className="flex items-center gap-0.5"><MessageCircle className="h-3.5 w-3.5" />0</span>
          </div>
        </div>
      </div>
    </article>
  )
}

/* ─── Latest post list item ──────────────────────────────────────────────── */
function LatestPostItem({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const cat = categoryOf(post)
  return (
    <article className="flex items-start gap-6 border-b border-gray-100 py-5 last:border-0">
      <div className="min-w-0 flex-1">
        <Link href={href}>
          <h3 className="text-[17px] font-bold leading-snug text-gray-900 hover:text-blue-600">
            {post.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{getExcerpt(post, 150)}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <AuthorAvatar name={post.authorName || 'A'} size="sm" />
          <span className="text-sm font-medium text-gray-700">{post.authorName || 'Author'}</span>
          <span className="text-gray-400">·</span>
          <span className="text-sm text-gray-400">{formatTimeAgo(post.publishedAt ?? post.createdAt)}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
          {cat && (
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${categoryColor(cat)}`}>
              {cat}
            </span>
          )}
          <span>{readTime(post)} min read</span>
          <span className="flex items-center gap-0.5"><Eye className="h-3.5 w-3.5" />{stableViewCount(post)} views</span>
          <span className="flex items-center gap-0.5"><Heart className="h-3.5 w-3.5" />0</span>
        </div>
      </div>
      <Link href={href} className="shrink-0">
        <img
          src={image}
          alt={post.title}
          className="h-20 w-32 rounded-xl object-cover sm:h-24 sm:w-40"
          loading="lazy"
        />
      </Link>
    </article>
  )
}

/* ─── Author card ────────────────────────────────────────────────────────── */
function AuthorCard({ authorName, postCount }: { authorName: string; postCount: number }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center transition hover:border-blue-200 hover:shadow-md">
      <AuthorAvatar name={authorName} size="lg" />
      <h4 className="mt-3 font-bold text-gray-900">{authorName}</h4>
      <span className="mt-2 rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700">
        {postCount} article{postCount !== 1 ? 's' : ''}
      </span>
      <div className="mt-3">
        <span className="cursor-default rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600">
          View Profile
        </span>
      </div>
    </div>
  )
}

/* ─── Editor Verified + Writer CTA + Stats + Authors + Latest Posts ──────── */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const verifiedPosts = all.slice(0, 3)
  const latestPosts = all.slice(0, 8)

  // Derive unique authors
  const authorMap = new Map<string, number>()
  for (const post of all) {
    const name = post.authorName || 'Anonymous'
    authorMap.set(name, (authorMap.get(name) || 0) + 1)
  }
  const authors = Array.from(authorMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return (
    <>
      {/* Editor Verified */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                <Check className="h-3.5 w-3.5 text-white" />
              </span>
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-900">Editor Verified</h2>
            </div>
            <Link href={primaryRoute} className="text-sm font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          {verifiedPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {verifiedPosts.map((post) => (
                <VerifiedCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No posts yet.</p>
          )}
        </div>
      </section>

      {/* Writer Platform CTA */}
      <section className="bg-white pb-10 pt-6">
        <div className="mx-auto max-w-[900px] px-4 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Your story{' '}
            <em className="not-italic font-extrabold text-blue-600" style={{ fontFamily: "'Fraunces', 'Georgia', serif", fontStyle: 'italic' }}>
              deserves
            </em>
            {' '}to be told.
          </h2>
          <p className="mt-4 text-base text-gray-500 sm:text-lg">
            Join 800,000+ writers on {SITE_CONFIG.name} where authentic voices find their audience.
          </p>

          {/* Gradient divider */}
          <div className="mx-auto mt-8 h-[3px] w-full max-w-xl rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Platform card */}
          <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
            <h3 className="text-center text-xl font-bold text-gray-900">Writer&apos;s Platform</h3>
            <p className="mt-1 text-center text-sm text-blue-600">Share your expertise with the world</p>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-blue-600">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm italic leading-relaxed text-gray-700">
                    &ldquo;Publishing on {SITE_CONFIG.name} has exceeded all my expectations. The platform is intuitive, the readers are thoughtful, and I&apos;ve grown so much as a writer here.&rdquo;
                  </p>
                  <p className="mt-2 text-sm font-semibold text-blue-600">— Featured Author</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[['S', 'bg-purple-500'], ['J', 'bg-blue-500'], ['E', 'bg-teal-500']].map(([letter, bg]) => (
                    <span key={letter} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${bg}`}>
                      {letter}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="h-4 w-4" /> 800K+ writers
                </span>
              </div>
              <Link
                href="/create"
                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-700"
              >
                Start Writing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white pb-12">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: '800K+', label: 'Active Authors' },
              { value: '2M+', label: 'Monthly Readers' },
              { value: '1.9M+', label: 'Articles Published' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-gray-200 p-6 text-center">
                <p className="text-3xl font-extrabold text-blue-600">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authors Leading the Way */}
      {authors.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-[1280px] px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Authors Leading the Way</h2>
              <p className="mt-2 text-gray-500">Meet the voices shaping our community</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {authors.map(({ name, count }) => (
                <AuthorCard key={name} authorName={name} postCount={count} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Latest Posts</h2>
            <p className="mt-1 text-gray-500">Just published: See what&apos;s new from our writers</p>
          </div>
          {latestPosts.length > 0 ? (
            <>
              <div className="mx-auto max-w-4xl">
                {latestPosts.map((post) => (
                  <LatestPostItem key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href={primaryRoute}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-600 px-7 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  View All Articles →
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-gray-400">No posts yet.</p>
          )}
        </div>
      </section>
    </>
  )
}

/* ─── CTA (absorbed into EditableTimeCollections) ───────────────────────── */
export function EditableHomeCta() {
  return null
}
