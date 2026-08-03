import type { Metadata } from 'next'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchHomeTaskFeed, fetchHomeTimeSections, type HomeTimeSection } from '@/lib/task-data'
import { pagesContent } from '@/editable/content/pages.content'
import type { SitePost } from '@/lib/site-connector'
import {
  EditableHomeHero,
  EditableMagazineSplit,
  EditableTimeCollections,
} from '@/editable/sections/HomeSections'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { Ads } from '@/lib/ads'
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: pagesContent.home.metadata.title,
    description: pagesContent.home.metadata.description,
    openGraphTitle: pagesContent.home.metadata.openGraphTitle,
    openGraphDescription: pagesContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...pagesContent.home.metadata.keywords],
  })
}

type TaskFeedItem = { task: (typeof SITE_CONFIG.tasks)[number]; posts: SitePost[] }

function uniquePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

export default async function HomePage() {
  const primaryTask = (SITE_CONFIG.tasks.find((task) => task.enabled)?.key || 'article') as TaskKey
  const primaryRoute = SITE_CONFIG.taskViews[primaryTask] || `/${primaryTask}`
  const taskFeed: TaskFeedItem[] = await fetchHomeTaskFeed(30, { timeoutMs: 2500 })
  const primaryPosts = uniquePosts(
    taskFeed.find(({ task }) => task.key === primaryTask)?.posts || taskFeed.flatMap(({ posts }) => posts)
  ).slice(0, 30)
  const timeSections: HomeTimeSection[] = await fetchHomeTimeSections(primaryTask, { limit: 10, timeoutMs: 2500 })
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')

  return (
    <EditableSiteShell>
      <main>
        <SchemaJsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: baseUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }}
        />

        {/* Dark hero with carousel */}
        <EditableHomeHero
          primaryTask={primaryTask}
          primaryRoute={primaryRoute}
          posts={primaryPosts}
          timeSections={timeSections}
        />

        <div className="mx-auto max-w-[1280px] px-4 py-4">
          <Ads slot="header" showLabel eager className="mx-auto w-full" />
        </div>

        {/* Editor's Pick + Hot Right Now */}
        <EditableMagazineSplit
          primaryTask={primaryTask}
          primaryRoute={primaryRoute}
          posts={primaryPosts}
          timeSections={timeSections}
        />

        {/* Editor Verified + Writer CTA + Stats + Authors + Latest Posts */}
        <EditableTimeCollections
          primaryTask={primaryTask}
          primaryRoute={primaryRoute}
          posts={primaryPosts}
          timeSections={timeSections}
        />

        <div className="mx-auto max-w-[1280px] px-4 py-4">
          <Ads slot="sidebar" showLabel eager className="mx-auto w-full" />
        </div>
      </main>
    </EditableSiteShell>
  )
}
