import { useEffect, useMemo, useState } from 'react';
import {
  MdAdd,
  MdAutoAwesome,
  MdCheckCircle,
  MdContentCopy,
  MdDelete,
  MdDownload,
  MdEventAvailable,
  MdFileUpload,
  MdLink,
  MdPlayCircle,
  MdRefresh,
  MdSearch,
  MdToday,
  MdVideoLibrary,
} from 'react-icons/md';

import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useNotification } from '../../hooks/useNotification';

const STORAGE_KEY = 'cybermilo_skill_vault_v1';
const TODAY_KEY = new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
  title: '',
  url: '',
  category: 'Facebook Saved',
  skill: '',
  difficulty: 'Beginner',
  priority: 'Medium',
  duration: '20',
  notes: '',
  practiceTask: '',
};

const SAMPLE_ITEMS = [
  {
    id: 'sample-1',
    title: 'Facebook saved video: replace with your first link',
    url: 'https://facebook.com/saved',
    category: 'Facebook Saved',
    skill: 'Content creation',
    difficulty: 'Beginner',
    priority: 'High',
    duration: 20,
    notes: 'Paste the video transcript, caption, or your rough notes here. The planner will turn it into practice steps.',
    practiceTask: 'Watch the video, write 3 key points, then repeat the technique once in your own project.',
    status: 'Not Started',
    createdAt: new Date().toISOString(),
    completedDates: [],
    lastPracticedAt: null,
  },
  {
    id: 'sample-2',
    title: 'Short-form editing technique',
    url: '',
    category: 'Video Editing',
    skill: 'Hook + retention',
    difficulty: 'Intermediate',
    priority: 'Medium',
    duration: 30,
    notes: 'Example item. Add your Facebook URL and the exact technique explained in the saved video.',
    practiceTask: 'Create one 15-second reel using the hook, cut, caption, and call-to-action structure.',
    status: 'Not Started',
    createdAt: new Date().toISOString(),
    completedDates: [],
    lastPracticedAt: null,
  },
];

const DIFFICULTY_STYLES = {
  Beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  Advanced: 'bg-rose-100 text-rose-700 border-rose-200',
};

function safeParseItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function makeId() {
  return `skill-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normaliseItem(item) {
  return {
    id: item.id || makeId(),
    title: item.title?.trim() || 'Untitled learning video',
    url: item.url?.trim() || '',
    category: item.category?.trim() || 'Facebook Saved',
    skill: item.skill?.trim() || 'General practice',
    difficulty: item.difficulty || 'Beginner',
    priority: item.priority || 'Medium',
    duration: Number(item.duration) || 20,
    notes: item.notes?.trim() || '',
    practiceTask: item.practiceTask?.trim() || 'Watch, summarise, practise once, and record what improved.',
    status: item.status || 'Not Started',
    createdAt: item.createdAt || new Date().toISOString(),
    completedDates: Array.isArray(item.completedDates) ? item.completedDates : [],
    lastPracticedAt: item.lastPracticedAt || null,
    aiSummary: item.aiSummary || '',
  };
}

function priorityScore(priority) {
  return { High: 3, Medium: 2, Low: 1 }[priority] || 1;
}

function recencyScore(item) {
  if (!item.lastPracticedAt) return 100;
  const days = Math.floor((Date.now() - new Date(item.lastPracticedAt).getTime()) / 86400000);
  return Math.max(days, 0);
}

function buildLocalSummary(item) {
  const notes = item.notes || 'No transcript or notes were added yet.';
  const keyLines = notes
    .split(/[\n.]/)
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 5);

  return [
    `Skill: ${item.skill || 'General practice'}`,
    `Main idea: ${keyLines[0] || `Study the saved video and extract the exact ${item.skill || 'skill'} technique.`}`,
    'Practice steps:',
    `1. Watch the video for ${item.duration || 20} minutes without multitasking.`,
    `2. Write 3 takeaways about ${item.skill || 'the technique'}.`,
    `3. Do this drill: ${item.practiceTask || 'repeat the technique once in your own work.'}`,
    '4. Mark it practiced only after creating a small output, not just watching.',
    'Review questions:',
    `- What is the repeatable technique?`,
    '- What mistake should you avoid next time?',
    '- What will you create tomorrow using this lesson?',
  ].join('\n');
}

function parseImportLines(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(',').map(part => part.trim());
      if (parts.length === 1) {
        return normaliseItem({ title: parts[0], url: parts[0].startsWith('http') ? parts[0] : '' });
      }
      const [title, url, category, skill, difficulty, priority] = parts;
      return normaliseItem({ title, url, category, skill, difficulty, priority });
    });
}

export default function SkillVaultPage() {
  const notification = useNotification();
  const [items, setItems] = useState(() => safeParseItems());
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const categories = useMemo(() => ['All', ...new Set(items.map(item => item.category).filter(Boolean))], [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter(item => {
      const matchesCategory = category === 'All' || item.category === category;
      const blob = `${item.title} ${item.skill} ${item.category} ${item.notes}`.toLowerCase();
      return matchesCategory && (!query || blob.includes(query));
    });
  }, [items, search, category]);

  const dailyPlan = useMemo(() => {
    return [...items]
      .filter(item => item.status !== 'Completed' || !item.completedDates?.includes(TODAY_KEY))
      .sort((a, b) => {
        const scoreA = priorityScore(a.priority) * 10 + recencyScore(a);
        const scoreB = priorityScore(b.priority) * 10 + recencyScore(b);
        return scoreB - scoreA;
      })
      .slice(0, 3);
  }, [items]);

  const selectedItem = useMemo(
    () => items.find(item => item.id === selectedId) || dailyPlan[0] || items[0],
    [items, selectedId, dailyPlan]
  );

  const stats = useMemo(() => {
    const practicedToday = items.filter(item => item.completedDates?.includes(TODAY_KEY)).length;
    const minutes = dailyPlan.reduce((sum, item) => sum + Number(item.duration || 0), 0);
    const skills = new Set(items.map(item => item.skill).filter(Boolean)).size;
    return { practicedToday, minutes, skills };
  }, [items, dailyPlan]);

  const updateItem = (id, patch) => {
    setItems(prev => prev.map(item => item.id === id ? normaliseItem({ ...item, ...patch }) : item));
  };

  const handleAdd = (event) => {
    event.preventDefault();
    if (!form.title.trim() && !form.url.trim()) {
      notification.error('Add at least a title or Facebook video link.');
      return;
    }
    const next = normaliseItem({ ...form, id: makeId(), createdAt: new Date().toISOString() });
    setItems(prev => [next, ...prev]);
    setSelectedId(next.id);
    setForm(EMPTY_FORM);
    notification.success('Saved video added to SkillVault.');
  };

  const markPracticed = (item) => {
    const dates = new Set(item.completedDates || []);
    dates.add(TODAY_KEY);
    updateItem(item.id, {
      status: 'Completed',
      completedDates: [...dates],
      lastPracticedAt: new Date().toISOString(),
    });
    notification.success('Practice logged for today.');
  };

  const generateSummary = (item) => {
    const aiSummary = buildLocalSummary(item);
    updateItem(item.id, { aiSummary });
    setSelectedId(item.id);
    notification.success('Practice details generated from your notes.');
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedId === id) setSelectedId(null);
    notification.success('Video removed.');
  };

  const seedSamples = () => {
    setItems(prev => [...SAMPLE_ITEMS.map(normaliseItem), ...prev]);
    notification.success('Starter practice videos added. Replace them with your Facebook saved links.');
  };

  const importItems = () => {
    const imported = parseImportLines(importText);
    if (!imported.length) {
      notification.error('Paste one video per line before importing.');
      return;
    }
    setItems(prev => [...imported, ...prev]);
    setImportText('');
    setShowImport(false);
    notification.success(`${imported.length} videos imported.`);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skill-vault-${TODAY_KEY}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyPlan = async () => {
    const text = dailyPlan.map((item, index) => `${index + 1}. ${item.title} — ${item.practiceTask}`).join('\n');
    await navigator.clipboard.writeText(text || 'No practice items yet.');
    notification.success('Today\'s practice plan copied.');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6 items-stretch">
          <GlassCard className="p-6 overflow-hidden relative">
            <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-[#0E7C7B]/10 blur-3xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100 mb-4">
                  <MdVideoLibrary className="w-4 h-4" /> Facebook saved-video practice system
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-950 mb-3">SkillVault Daily Practice</h1>
                <p className="text-slate-600 max-w-3xl">
                  Collect saved Facebook video links, organise them by skill, generate practice details from your notes,
                  and get a focused daily automation plan. Private Facebook videos must be added manually by link,
                  transcript, caption, or your own notes.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" icon={MdFileUpload} onClick={() => setShowImport(prev => !prev)}>Import</Button>
                <Button variant="secondary" icon={MdDownload} onClick={exportJson} disabled={!items.length}>Export</Button>
                <Button icon={MdRefresh} onClick={seedSamples}>Starter Data</Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-slate-950 text-white border-slate-800">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-[#F4B860] text-slate-950">
                <MdToday className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-white text-2xl mb-1">Today&apos;s Automation</h2>
                <p className="text-white/55 text-sm mb-0">{TODAY_KEY} · {stats.minutes} planned minutes</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <p className="text-white/50 text-xs mb-1">Practiced today</p>
                <p className="text-2xl font-extrabold text-white mb-0">{stats.practicedToday}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <p className="text-white/50 text-xs mb-1">Skills organised</p>
                <p className="text-2xl font-extrabold text-white mb-0">{stats.skills}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {showImport && (
          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-slate-950 mb-1">Bulk import Facebook saved links</h3>
                <p className="text-sm text-slate-500 mb-0">Paste one per line: title,url,category,skill,difficulty,priority. A plain URL also works.</p>
              </div>
              <Button size="sm" onClick={importItems}>Import Videos</Button>
            </div>
            <textarea
              value={importText}
              onChange={event => setImportText(event.target.value)}
              rows={5}
              className="input-glass w-full min-h-32"
              placeholder="Example: CapCut hook tutorial,https://facebook.com/...,Video Editing,Hooks,Beginner,High"
            />
          </GlassCard>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
          <GlassCard className="p-5">
            <h2 className="text-2xl text-slate-950 mb-1">Add saved video</h2>
            <p className="text-sm text-slate-500 mb-5">Add the Facebook link plus transcript/caption notes so the app can organise and generate practice.</p>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input label="Video title" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="e.g. Facebook ad copywriting lesson" />
              <Input label="Facebook/video link" leftIcon={MdLink} value={form.url} onChange={event => setForm({ ...form, url: event.target.value })} placeholder="https://facebook.com/..." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Category" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} />
                <Input label="Skill / technique" value={form.skill} onChange={event => setForm({ ...form, skill: event.target.value })} placeholder="e.g. Sales closing" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Difficulty</label>
                  <select className="input-glass w-full" value={form.difficulty} onChange={event => setForm({ ...form, difficulty: event.target.value })}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
                  <select className="input-glass w-full" value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value })}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <Input label="Minutes" type="number" min="5" value={form.duration} onChange={event => setForm({ ...form, duration: event.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Transcript / notes / what the video teaches</label>
                <textarea className="input-glass w-full min-h-28" value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} placeholder="Paste caption, transcript, or your notes here..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Practice task</label>
                <textarea className="input-glass w-full min-h-20" value={form.practiceTask} onChange={event => setForm({ ...form, practiceTask: event.target.value })} placeholder="What should you do after watching?" />
              </div>
              <Button type="submit" icon={MdAdd} className="w-full">Add to SkillVault</Button>
            </form>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl text-slate-950 mb-1">Daily practice queue</h2>
                  <p className="text-sm text-slate-500 mb-0">Automatically selected by priority and last practice date.</p>
                </div>
                <Button variant="secondary" size="sm" icon={MdContentCopy} onClick={copyPlan} disabled={!dailyPlan.length}>Copy plan</Button>
              </div>
              <div className="space-y-3">
                {dailyPlan.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                    Add videos to generate your daily plan.
                  </div>
                )}
                {dailyPlan.map((item, index) => (
                  <div key={item.id} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <button onClick={() => setSelectedId(item.id)} className="text-left flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-7 h-7 rounded-full bg-slate-950 text-white text-xs font-bold flex items-center justify-center">{index + 1}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${DIFFICULTY_STYLES[item.difficulty] || DIFFICULTY_STYLES.Beginner}`}>{item.difficulty}</span>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">{item.priority}</span>
                        </div>
                        <h3 className="text-lg text-slate-950 mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 mb-0">{item.skill} · {item.duration} min · {item.category}</p>
                      </button>
                      <div className="flex flex-wrap gap-2">
                        {item.url && <Button variant="secondary" size="sm" icon={MdPlayCircle} onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}>Open</Button>}
                        <Button size="sm" icon={MdCheckCircle} onClick={() => markPracticed(item)}>Practiced</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-4">
                <Input leftIcon={MdSearch} value={search} onChange={event => setSearch(event.target.value)} placeholder="Search title, skill, category, notes..." />
                <select className="input-glass min-w-44" value={category} onChange={event => setCategory(event.target.value)}>
                  {categories.map(option => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredItems.map(item => (
                  <div key={item.id} className={`rounded-2xl border p-4 bg-white transition ${selectedItem?.id === item.id ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'}`}>
                    <button onClick={() => setSelectedId(item.id)} className="w-full text-left">
                      <h3 className="text-base text-slate-950 mb-1 line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-slate-500 mb-3">{item.skill} · {item.category}</p>
                    </button>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">{item.completedDates?.length || 0} practice logs</span>
                      <button onClick={() => removeItem(item.id)} className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50" aria-label="Remove video">
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {selectedItem && (
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">{selectedItem.category}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-teal-50 text-teal-700">{selectedItem.skill}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700">{selectedItem.duration} min</span>
                </div>
                <h2 className="text-2xl text-slate-950 mb-2">{selectedItem.title}</h2>
                <p className="text-slate-500 mb-0">{selectedItem.practiceTask}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedItem.url && <Button variant="secondary" icon={MdPlayCircle} onClick={() => window.open(selectedItem.url, '_blank', 'noopener,noreferrer')}>Open Video</Button>}
                <Button variant="secondary" icon={MdAutoAwesome} onClick={() => generateSummary(selectedItem)}>Generate details</Button>
                <Button icon={MdEventAvailable} onClick={() => markPracticed(selectedItem)}>Log Today</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <h3 className="text-slate-950 mb-3">Original notes / transcript</h3>
                <p className="text-sm text-slate-600 whitespace-pre-wrap mb-0">{selectedItem.notes || 'No notes added yet. Paste the video caption, transcript, or your rough points when adding a video.'}</p>
              </div>
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 text-white">
                <h3 className="text-white mb-3">AI-style practice details</h3>
                <p className="text-sm text-white/75 whitespace-pre-wrap mb-0">{selectedItem.aiSummary || 'Click “Generate details” to turn your notes into key points, drills, and review questions.'}</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </MainLayout>
  );
}
