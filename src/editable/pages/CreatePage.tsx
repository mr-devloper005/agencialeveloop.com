'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = 'rounded-xl border border-[var(--editable-border)] bg-[#f7f9f8] px-4 py-3.5 text-sm font-semibold text-[#0B0909] outline-none transition duration-300 placeholder:text-[#78908b] focus:border-[#408175] focus:bg-white focus:shadow-[0_0_0_4px_rgba(64,129,117,.10)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[#f4f7f6] px-4 py-12 text-[#0B0909] sm:px-6 lg:px-8 lg:py-20">
          <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-[0_30px_90px_rgba(46,69,64,.12)] md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-80 items-center justify-center overflow-hidden bg-[#0B0909] text-white">
              <div className="editable-glow absolute -left-16 top-0 h-64 w-64 rounded-full bg-[#408175]/40 blur-3xl" />
              <div className="editable-float absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-[#B5B9F0]/25 blur-3xl" />
              <Lock className="relative h-20 w-20 text-[#B5B9F0]" />
            </div>
            <div className="self-center p-8 sm:p-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#408175]">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-5xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-[#408175] px-6 py-3 text-sm font-bold text-white">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl border border-[var(--editable-border)] bg-white px-6 py-3 text-sm font-bold">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#f4f7f6] text-[#0B0909]">
        <section className="relative overflow-hidden bg-[#0B0909] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-16">
          <div className="editable-glow absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#408175]/35 blur-3xl" />
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_20%,rgba(181,185,240,.28),transparent_48%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)]">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#B5B9F0]">{pagesContent.create.hero.badge}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-6xl">Share something useful with the community.</h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/65">Choose a format, add the essential details, and publish an article or business listing that is clear and easy to discover.</p>
          </div>
        </section>
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-4xl">
            <form onSubmit={submit} className="rounded-3xl border border-[var(--editable-border)] bg-white p-5 shadow-[0_20px_60px_rgba(46,69,64,.08)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#408175]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-[#B5B9F0]/35 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2E4540]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#408175] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.16em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#2E4540] hover:shadow-[0_14px_30px_rgba(46,69,64,.22)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
