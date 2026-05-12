import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import {
  Activity,
  AtSign,
  Bell,
  Bot,
  Check,
  ChevronDown,
  CircleDashed,
  Clock3,
  Copy,
  Gauge,
  Ghost,
  Heart,
  ListChecks,
  MousePointer2,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import './style.css'

type QueueAction = 'review' | 'keep' | 'mute' | 'unfollow'
type Tone = 'human' | 'sharp' | 'builder'
type View = 'overview' | 'audience' | 'queue' | 'publisher' | 'experiments'

const navItems = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'audience', label: 'Audience', icon: Users },
  { id: 'queue', label: 'Hygiene Queue', icon: ListChecks },
  { id: 'publisher', label: 'Publisher', icon: Send },
  { id: 'experiments', label: 'Experiments', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

const accountStats = [
  { label: 'Followers', value: '0', change: '+0 today', tone: 'flat' },
  { label: 'Following', value: '12', change: '+1 this week', tone: 'good' },
  { label: 'Signal score', value: '64', change: '+9 from cleanup', tone: 'good' },
  { label: 'Review queue', value: '18', change: '6 high priority', tone: 'warn' },
]

const healthChecks = [
  { label: 'Browser-first x-publisher', value: 92, status: 'Ready' },
  { label: 'Follow quality', value: 68, status: 'Needs review' },
  { label: 'Posting rhythm', value: 47, status: 'Too quiet' },
]

const audienceRows = [
  {
    handle: '@ICE257_',
    name: 'Ice',
    type: 'Core signal',
    score: 98,
    relation: 'repost + reply often',
    reason: 'source account and strongest network bridge',
  },
  {
    handle: '@OpenAIDevs',
    name: 'OpenAI Developers',
    type: 'Community',
    score: 84,
    relation: 'watchlist',
    reason: 'developer audience overlap, reply when useful',
  },
  {
    handle: '@thebuggeddev',
    name: 'The Bugged Dev',
    type: 'AI media',
    score: 77,
    relation: 'engage lightly',
    reason: 'visual AI content performs well for builders',
  },
  {
    handle: '@Lengranmi',
    name: 'Vintage',
    type: 'Local network',
    score: 72,
    relation: 'follow candidate',
    reason: 'shared Nigerian tech orbit and repost overlap',
  },
]

const queueSeed = [
  {
    handle: '@ghostbuilds',
    name: 'Ghost Builds',
    tag: 'silent follow',
    score: 21,
    action: 'mute' as QueueAction,
    reason: 'No replies, no mutuals, low topic fit. Timeline clutter ngl.',
  },
  {
    handle: '@toolshipper',
    name: 'Tool Shipper',
    tag: 'builder',
    score: 88,
    action: 'keep' as QueueAction,
    reason: 'Posts small dev tools, likely good Unfollowr audience.',
  },
  {
    handle: '@followtrain_ai',
    name: 'AI Follow Train',
    tag: 'growth bait',
    score: 12,
    action: 'unfollow' as QueueAction,
    reason: 'Looks like engagement farming. We are not doing that movie.',
  },
  {
    handle: '@tinyagents',
    name: 'Tiny Agents',
    tag: 'agent dev',
    score: 81,
    action: 'review' as QueueAction,
    reason: 'Relevant, but needs one more pass before following back.',
  },
]

const experiments = [
  {
    title: 'No-link Reddit rehab',
    detail: '10 normal comments before the next project link. Build trust first.',
    status: 'active',
  },
  {
    title: 'Unfollowr build log',
    detail: 'Short daily posts with one weird account-health observation.',
    status: 'active',
  },
  {
    title: 'ICE orbit replies',
    detail: 'Reply when there is a real angle. No robotic "great point" slop.',
    status: 'watching',
  },
]

const toneDrafts: Record<Tone, string> = {
  human:
    'small account cleanup thought: if you cannot explain why you follow someone, that follow is probably just timeline debt lol',
  sharp:
    'following 900 accounts and calling the timeline bad is basically throwing socks everywhere then blaming the room',
  builder:
    'building Unfollowr around one simple idea: account hygiene should be reviewable, not vibes-based doomscrolling.',
}

function App() {
  const [activeView, setActiveView] = useDashboardView()
  const [queue, setQueue] = useQueueState()
  const [selectedTone, setSelectedTone] = useToneState()
  const [draft, setDraft] = useDraftState(selectedTone)
  const [copied, setCopied] = useCopyState()

  const selectedCount = queue.filter((item) => item.action !== 'review').length
  const composerUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(draft)}`

  const updateAction = (handle: string, action: QueueAction) => {
    setQueue((items) => items.map((item) => (item.handle === handle ? { ...item, action } : item)))
  }

  const useTone = (tone: Tone) => {
    setSelectedTone(tone)
    setDraft(toneDrafts[tone])
  }

  const copyPlan = async () => {
    const plan = [
      'x-publisher browser-first plan',
      `account=@frost_index`,
      `tone=${selectedTone}`,
      `text=${draft}`,
      `composer=${composerUrl}`,
    ].join('\n')

    await navigator.clipboard.writeText(plan)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <div className="brand-mark">Uf</div>
          <div>
            <strong>Unfollowr</strong>
            <span>Account hygiene for X</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                className={isActive ? 'nav-item active' : 'nav-item'}
                key={item.id}
                onClick={() => item.id !== 'settings' && setActiveView(item.id)}
                type="button"
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-note">
          <ShieldCheck size={18} />
          <span>Browser-first publishing. No paid API drama by default.</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>{viewTitle(activeView)}</h1>
            <p>@frost_index synced 4 min ago. Reddit is in no-link trust mode.</p>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Refresh account">
              <RefreshCw size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Notifications">
              <Bell size={18} />
              <span className="dot" />
            </button>
            <button className="primary-button" type="button" onClick={() => setActiveView('publisher')}>
              <Send size={17} />
              Draft post
            </button>
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="main-column">
            <div className="metric-grid">
              {accountStats.map((stat) => (
                <article className="metric-card" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <em className={`metric-${stat.tone}`}>{stat.change}</em>
                </article>
              ))}
            </div>

            <section className="panel health-panel">
              <div className="section-heading">
                <div>
                  <h2>Account health</h2>
                  <p>What needs attention before the next growth push.</p>
                </div>
                <button className="ghost-button" type="button">
                  <Activity size={16} />
                  Run audit
                </button>
              </div>

              <div className="health-list">
                {healthChecks.map((check) => (
                  <div className="health-row" key={check.label}>
                    <div>
                      <strong>{check.label}</strong>
                      <span>{check.status}</span>
                    </div>
                    <div className="meter" aria-label={`${check.label} ${check.value}%`}>
                      <span style={{ width: `${check.value}%` }} />
                    </div>
                    <b>{check.value}</b>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel queue-panel">
              <div className="section-heading">
                <div>
                  <h2>Hygiene queue</h2>
                  <p>{selectedCount} actions staged. Review before anything touches the account.</p>
                </div>
                <div className="segmented">
                  <button type="button" className="active">
                    High signal
                  </button>
                  <button type="button">All</button>
                </div>
              </div>

              <div className="queue-table">
                {queue.map((item) => (
                  <article className="queue-row" key={item.handle}>
                    <div className="avatar">{item.name.slice(0, 2)}</div>
                    <div className="queue-person">
                      <strong>{item.name}</strong>
                      <span>
                        {item.handle} / {item.tag}
                      </span>
                    </div>
                    <div className="score-pill">{item.score}</div>
                    <p>{item.reason}</p>
                    <ActionSelect value={item.action} onChange={(action) => updateAction(item.handle, action)} />
                  </article>
                ))}
              </div>
            </section>

            <section className="panel audience-panel">
              <div className="section-heading">
                <div>
                  <h2>Audience map</h2>
                  <p>Accounts worth watching before following, replying, or reposting.</p>
                </div>
                <div className="search-chip">
                  <Search size={15} />
                  AI builders
                </div>
              </div>

              <div className="audience-list">
                {audienceRows.map((row) => (
                  <article className="audience-row" key={row.handle}>
                    <div>
                      <strong>{row.name}</strong>
                      <span>{row.handle}</span>
                    </div>
                    <b>{row.type}</b>
                    <p>{row.reason}</p>
                    <em>{row.relation}</em>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="side-column">
            <section className="panel publisher-panel">
              <div className="publisher-header">
                <div className="publisher-icon">
                  <AtSign size={20} />
                </div>
                <div>
                  <h2>x-publisher</h2>
                  <p>Browser-first composer plan</p>
                </div>
              </div>

              <div className="status-stack">
                <StatusLine icon={MousePointer2} label="Default path" value="Edge browser" />
                <StatusLine icon={Bot} label="XMCP/API" value="Ask free vs paid first" />
                <StatusLine icon={Clock3} label="Next safe action" value="No-link post or reply" />
              </div>

              <div className="tone-picker" aria-label="Draft tone">
                {(['human', 'sharp', 'builder'] as Tone[]).map((tone) => (
                  <button
                    className={selectedTone === tone ? 'active' : ''}
                    key={tone}
                    onClick={() => useTone(tone)}
                    type="button"
                  >
                    {tone}
                  </button>
                ))}
              </div>

              <label className="composer-label" htmlFor="publisher-draft">
                Draft
              </label>
              <textarea
                id="publisher-draft"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={6}
              />

              <div className="composer-meta">
                <span>{draft.length}/280</span>
                <span>No link attached</span>
              </div>

              <div className="checklist">
                <span>
                  <Check size={15} /> visible account: @frost_index
                </span>
                <span>
                  <Check size={15} /> browser composer required
                </span>
                <span>
                  <CircleDashed size={15} /> log result after posting
                </span>
              </div>

              <div className="publisher-actions">
                <a className="primary-button wide" href={composerUrl} target="_blank" rel="noreferrer">
                  <Send size={17} />
                  Open composer
                </a>
                <button className="ghost-button" type="button" onClick={copyPlan}>
                  <Copy size={16} />
                  {copied ? 'Copied' : 'Copy plan'}
                </button>
              </div>
            </section>

            <section className="panel activity-panel">
              <div className="section-heading compact">
                <h2>Action log</h2>
                <span>Today</span>
              </div>
              <TimelineItem icon={Send} title="Posted no-link Unfollowr update" detail="Verified visible on @frost_index." />
              <TimelineItem icon={Ghost} title="Reddit link drops paused" detail="Two links were removed. Trust mode now." />
              <TimelineItem icon={Heart} title="Human tone enabled" detail="Less pitch deck, more actual person." />
            </section>

            <section className="panel experiments-panel">
              <div className="section-heading compact">
                <h2>Experiments</h2>
                <span>3 live</span>
              </div>
              {experiments.map((item) => (
                <article className="experiment" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <span>{item.status}</span>
                </article>
              ))}
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

function ActionSelect({ value, onChange }: { value: QueueAction; onChange: (value: QueueAction) => void }) {
  return (
    <div className={`action-select action-${value}`}>
      <select value={value} onChange={(event) => onChange(event.target.value as QueueAction)} aria-label="Queue action">
        <option value="review">Review</option>
        <option value="keep">Keep</option>
        <option value="mute">Mute</option>
        <option value="unfollow">Unfollow</option>
      </select>
      <ChevronDown size={14} />
    </div>
  )
}

function StatusLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity
  label: string
  value: string
}) {
  return (
    <div className="status-line">
      <Icon size={16} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function TimelineItem({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Activity
  title: string
  detail: string
}) {
  return (
    <article className="timeline-item">
      <div className="timeline-icon">
        <Icon size={15} />
      </div>
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
    </article>
  )
}

function viewTitle(view: View) {
  const titles: Record<View, string> = {
    overview: 'Command center',
    audience: 'Audience map',
    queue: 'Hygiene queue',
    publisher: 'Publisher',
    experiments: 'Experiments',
  }

  return titles[view]
}

function useDashboardView() {
  return useState<View>('overview')
}

function useQueueState() {
  return useState(queueSeed)
}

function useToneState() {
  return useState<Tone>('human')
}

function useDraftState(tone: Tone) {
  return useState(toneDrafts[tone])
}

function useCopyState() {
  return useState(false)
}

createRoot(document.getElementById('app')!).render(<App />)
