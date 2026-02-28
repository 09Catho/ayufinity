import { useMemo, useState } from 'react'

type ViewId =
  | 'overview'
  | 'case-workbench'
  | 'care-ops'
  | 'knowledge'
  | 'rules-engines'
  | 'safety-evidence'
  | 'admin'

const navItems: { id: ViewId; label: string; hint: string }[] = [
  { id: 'overview', label: 'Overview', hint: 'Live clinic cockpit' },
  { id: 'case-workbench', label: 'Case Workbench', hint: 'Interpret to finalize' },
  { id: 'care-ops', label: 'Care Ops', hint: 'Patients and schedules' },
  { id: 'knowledge', label: 'Knowledge Base', hint: 'Tags and conditions' },
  { id: 'rules-engines', label: 'Rules and Engines', hint: 'AAHAR VIHAR AUSHADH' },
  { id: 'safety-evidence', label: 'Safety and Evidence', hint: 'Contra and outcomes' },
  { id: 'admin', label: 'Admin and Access', hint: 'Users settings tokens' },
]

const kpiCards = [
  { label: 'Open Cases', value: '148', delta: '+12 today' },
  { label: 'Appointments', value: '64', delta: '18 follow-up due' },
  { label: 'Generated Plans', value: '92%', delta: 'Rule + evidence success rate' },
  { label: 'Red Flag Escalations', value: '03', delta: 'Auto-routed to supervisor' },
]

const flowSteps = [
  'Case creation and actor assignment',
  'Intake tag entry for symptoms and lifestyle',
  'Interpretation engine derives context tags',
  'Disease hypothesis scoring by condition index',
  'Root-cause confidence generation',
  'Case context signature hash build',
  'Parallel AAHAR VIHAR AUSHADH generation',
  'Contra and safety filter pass',
  'Evidence ranking with weighted score blend',
  'Generated plan persisted to plan tables',
  'Doctor finalization and edits',
  'Follow-up and daily logs capture',
  'Async evidence learning update worker',
]

const endpointCoverage = [
  {
    endpoint: 'POST /interpret',
    reads: 'InterpretationRules, InterpretationRuleConditions, TagDictionary',
    writes: 'IntakeHistory, CaseTagMap, ObservationsExam, DiagnosticTests, DerivedTags, CaseContextSignature',
  },
  {
    endpoint: 'POST /hypotheses',
    reads: 'ConditionsMaster, ConditionTagIndex',
    writes: 'DiseaseHypotheses, RootCauseHypotheses, RootCauseHypothesisContributors',
  },
  {
    endpoint: 'POST /generate-plan',
    reads: 'RuleTagIndex, ComponentTagIndex, ContraTagIndex, EvidenceComponentStats',
    writes: 'GeneratedPlanHeader, GeneratedPlanModules, GeneratedPlanComponentMap',
  },
  {
    endpoint: 'POST /finalize-plan and /appointments',
    reads: 'PractitionerAvailability, PractitionerLeave, Appointments',
    writes: 'FinalPlanHeader, FinalPlanModules, Appointments',
  },
]

const careQueue = [
  {
    slot: '09:30 - 10:00',
    patient: 'Riya Sharma',
    type: 'CONSULT',
    owner: 'Dr Rahul',
    linkedCase: 'CASE-2007',
    status: 'Intake complete',
  },
  {
    slot: '10:00 - 10:30',
    patient: 'Aman Verma',
    type: 'FOLLOWUP',
    owner: 'Dr Kavya',
    linkedCase: 'CASE-2022',
    status: 'Plan finalized',
  },
  {
    slot: '10:30 - 11:00',
    patient: 'Sana Malik',
    type: 'PROGRAM_SESSION',
    owner: 'Dr Rahul',
    linkedCase: 'CASE-2045',
    status: 'Evidence update pending',
  },
]

const derivedTags = [
  { tag: 'DIGESTIVE_IMBALANCE', strength: 82, source: 'RULE_ENGINE' },
  { tag: 'AGNI_LOW', strength: 75, source: 'RULE_ENGINE' },
  { tag: 'VATA_AGGRAVATION', strength: 70, source: 'RULE_ENGINE' },
]

const conditionHypotheses = [
  { condition: 'Functional Dyspepsia', confidence: 55, reason: 'Tag overlap and weighted support' },
  { condition: 'IBS pattern', confidence: 20, reason: 'Stress and bowel variability contributors' },
]

const rootCauseHypotheses = [
  { root: 'MANDAGNI', confidence: 72, contributors: 'LATE_DINNER + AGNI_LOW' },
  { root: 'STRESS_DRIVEN_VATA', confidence: 65, contributors: 'HIGH_STRESS + VATA_AGGRAVATION' },
]

const generatedModules = [
  {
    type: 'AAHAR',
    confidence: 73,
    text: 'Early light dinner before 8 PM, warm lunch, avoid curd at night.',
    evidence: 'Early dinner score 78 from 120 similar contexts',
  },
  {
    type: 'VIHAR',
    confidence: 68,
    text: '10-minute breathing and fixed sleep by 10:30 PM.',
    evidence: 'Fixed sleep score 65 with moderate evidence volume',
  },
  {
    type: 'AUSHADH',
    confidence: 60,
    text: 'Triphala at bedtime when no active contraindication.',
    evidence: 'Blocked for high-risk pregnancy tags',
  },
]

const featureCoverage = [
  {
    domain: 'Foundation and Access',
    summary: 'Clinic tenancy, user permissions, hierarchy and tokens.',
    tables: ['Clinics', 'Users', 'UserRoles', 'UserClinicMap', 'InternSupervisorMap', 'SystemSettings', 'ApiTokens'],
  },
  {
    domain: 'Patient and Program Operations',
    summary: 'Patient records, calendar control, practitioner slots and program enrollments.',
    tables: ['Patients', 'Appointments', 'PractitionerAvailability', 'PractitionerLeave', 'Programs', 'ProgramEnrollment', 'CaseProgramMap'],
  },
  {
    domain: 'Case Lifecycle',
    summary: 'End-to-end case tracking, files, intake and contextual signature.',
    tables: ['Cases', 'CaseActors', 'CaseStatusHistory', 'CaseFiles', 'IntakeHistory', 'ObservationsExam', 'DiagnosticTests', 'TestAttachments', 'CaseTagMap', 'DerivedTags', 'CaseContextSignature'],
  },
  {
    domain: 'Clinical Intelligence',
    summary: 'Tag dictionary, condition lookup and hypothesis explainability.',
    tables: ['TagDictionary', 'TagAliases', 'ContraDictionary', 'InterpretationRules', 'InterpretationRuleConditions', 'InterpretationRuleOutputs', 'ConditionsMaster', 'ConditionTagIndex', 'DiseaseHypotheses', 'RootCauseHypotheses', 'RootCauseHypothesisContributors'],
  },
  {
    domain: 'Rules and Component Engines',
    summary: 'AAHAR, VIHAR, YOGA and AUSHADH libraries with normalized rules.',
    tables: ['AaharComponents', 'ViharComponents', 'YogaProtocols', 'AushadhComponents', 'AaharRules', 'AaharRuleConditions', 'AaharRuleOutputs', 'ViharRules', 'ViharRuleConditions', 'ViharRuleOutputs', 'AushadhRules', 'AushadhRuleConditions', 'AushadhRuleOutputs', 'ComponentContraMap', 'RuleTagIndex', 'ComponentTagIndex', 'ContraTagIndex'],
  },
  {
    domain: 'Plan and Learning Loop',
    summary: 'Generated and finalized plan workflow plus outcome-backed learning.',
    tables: ['GeneratedPlanHeader', 'GeneratedPlanModules', 'GeneratedPlanComponentMap', 'FinalPlanHeader', 'FinalPlanModules', 'EvidenceComponentStats'],
  },
]

const evidenceRows = [
  { component: 'Early light dinner', n: 120, avgImprovement: '62%', sideEffectRate: '0.05', score: '78' },
  { component: 'Warm lunch routine', n: 95, avgImprovement: '58%', sideEffectRate: '0.03', score: '74' },
  { component: 'Fixed sleep window', n: 87, avgImprovement: '52%', sideEffectRate: '0.02', score: '69' },
]

function App() {
  const [activeView, setActiveView] = useState<ViewId>('overview')
  const activeViewMeta = useMemo(() => navItems.find((item) => item.id === activeView), [activeView])

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl gap-4 lg:gap-6">
        <aside className="glass-panel hidden w-72 shrink-0 rounded-3xl p-5 lg:flex lg:flex-col">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--crm-muted)]">Ayufinity CRM</p>
            <h1 className="title-font mt-3 text-3xl text-[var(--crm-heading)]">Doctor Panel</h1>
            <p className="mt-2 text-sm text-[var(--crm-muted)]">Flow and table-aware interface aligned to all planned platform features.</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  activeView === item.id
                    ? 'border-transparent bg-[var(--crm-brand)] text-white shadow-lg shadow-emerald-700/20'
                    : 'border-[var(--crm-border)] bg-white/65 text-[var(--crm-heading)] hover:bg-white'
                }`}
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className={`mt-1 text-xs ${activeView === item.id ? 'text-white/80' : 'text-[var(--crm-muted)]'}`}>{item.hint}</p>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-[var(--crm-heading)] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Engine Mode</p>
            <p className="mt-2 text-sm font-semibold">RULES + EVIDENCE</p>
            <p className="mt-1 text-xs text-white/75">Inverted indexes active with safety gate and explainability trail.</p>
          </div>
        </aside>

        <main className="w-full space-y-4 md:space-y-5">
          <div className="glass-panel rounded-3xl p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--crm-muted)]">Clinic Ops Console</p>
                <h2 className="title-font mt-2 text-3xl text-[var(--crm-heading)] md:text-4xl">{activeViewMeta?.label}</h2>
                <p className="mt-2 max-w-3xl text-sm text-[var(--crm-muted)]">Ayufinity Noida | Doctor-owned review lane with intern collaboration, evidence updates and case-state visibility.</p>
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-2 md:w-[340px]">
                <button type="button" className="rounded-2xl border border-[var(--crm-border)] bg-white/80 px-4 py-2 font-semibold text-[var(--crm-heading)]">+ New Case</button>
                <button type="button" className="rounded-2xl border border-transparent bg-[var(--crm-accent)] px-4 py-2 font-semibold text-white">Finalize Plan</button>
                <button type="button" className="rounded-2xl border border-[var(--crm-border)] bg-white/80 px-4 py-2 font-semibold text-[var(--crm-heading)]">Book Appointment</button>
                <button type="button" className="rounded-2xl border border-[var(--crm-border)] bg-white/80 px-4 py-2 font-semibold text-[var(--crm-heading)]">Run Hypotheses</button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-auto pb-1 lg:hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    activeView === item.id
                      ? 'border-transparent bg-[var(--crm-brand)] text-white'
                      : 'border-[var(--crm-border)] bg-white/80 text-[var(--crm-heading)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {activeView === 'overview' && (
            <section className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpiCards.map((card, index) => (
                  <article key={card.label} className="glass-panel fade-up rounded-2xl p-4" style={{ animationDelay: `${index * 80}ms` }}>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--crm-muted)]">{card.label}</p>
                    <p className="mt-2 text-3xl font-extrabold text-[var(--crm-heading)]">{card.value}</p>
                    <p className="mt-1 text-sm text-[var(--crm-muted)]">{card.delta}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <article className="glass-panel rounded-2xl p-4 md:p-5">
                  <h3 className="text-lg font-bold text-[var(--crm-heading)]">13-Step Care Flow Runtime</h3>
                  <div className="mt-4 space-y-3">
                    {flowSteps.map((step, index) => (
                      <div key={step} className="flex items-start gap-3 rounded-xl border border-[var(--crm-border)] bg-white/70 p-3">
                        <span className="mt-0.5 rounded-full bg-[var(--crm-brand)] px-2 py-0.5 text-xs font-bold text-white">{index + 1}</span>
                        <p className="text-sm text-[var(--crm-text)]">{step}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="glass-panel rounded-2xl p-4 md:p-5">
                  <h3 className="text-lg font-bold text-[var(--crm-heading)]">Today Queue Snapshot</h3>
                  <div className="mt-4 space-y-3">
                    {careQueue.map((row) => (
                      <div key={row.linkedCase} className="rounded-xl border border-[var(--crm-border)] bg-white/70 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--crm-muted)]">{row.slot} | {row.type}</p>
                        <p className="mt-1 text-sm font-semibold text-[var(--crm-heading)]">{row.patient} with {row.owner}</p>
                        <p className="mt-1 text-xs text-[var(--crm-muted)]">{row.linkedCase} - {row.status}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          )}

          {activeView === 'case-workbench' && (
            <section className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-3">
                <article className="glass-panel rounded-2xl p-4 md:p-5 xl:col-span-2">
                  <h3 className="text-lg font-bold text-[var(--crm-heading)]">Interpretation Output</h3>
                  <p className="mt-1 text-sm text-[var(--crm-muted)]">Case CASE-2007 moved from INTAKE_DONE to GENERATED with signature SIG-9fd12a.</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {derivedTags.map((row) => (
                      <div key={row.tag} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--crm-muted)]">{row.source}</p>
                        <p className="mt-1 text-sm font-bold text-[var(--crm-heading)]">{row.tag}</p>
                        <p className="mt-1 text-xs text-[var(--crm-muted)]">Strength {row.strength}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="glass-panel rounded-2xl p-4 md:p-5">
                  <h3 className="text-lg font-bold text-[var(--crm-heading)]">Case Status Rail</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {['NEW', 'INTAKE_DONE', 'GENERATED', 'FINALIZED', 'FOLLOWUP_DUE', 'CLOSED'].map((state, index) => (
                      <li key={state} className="flex items-center justify-between rounded-xl border border-[var(--crm-border)] bg-white/80 px-3 py-2">
                        <span>{state}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${index <= 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}>
                          {index <= 3 ? 'Reached' : 'Pending'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <article className="glass-panel rounded-2xl p-4 md:p-5">
                  <h3 className="text-lg font-bold text-[var(--crm-heading)]">Hypothesis Engine</h3>
                  <div className="mt-4 space-y-3">
                    {conditionHypotheses.map((row) => (
                      <div key={row.condition} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-[var(--crm-heading)]">{row.condition}</p>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">{row.confidence}%</span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--crm-muted)]">{row.reason}</p>
                      </div>
                    ))}
                  </div>
                  <h4 className="mt-5 text-sm font-bold uppercase tracking-[0.15em] text-[var(--crm-muted)]">Root Cause</h4>
                  <div className="mt-2 space-y-3">
                    {rootCauseHypotheses.map((row) => (
                      <div key={row.root} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-[var(--crm-heading)]">{row.root}</p>
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">{row.confidence}%</span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--crm-muted)]">{row.contributors}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="glass-panel rounded-2xl p-4 md:p-5">
                  <h3 className="text-lg font-bold text-[var(--crm-heading)]">Generated Plan Modules</h3>
                  <div className="mt-4 space-y-3">
                    {generatedModules.map((module) => (
                      <div key={module.type} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-[var(--crm-heading)]">{module.type}</p>
                          <span className="rounded-full bg-[#ddeee7] px-2 py-0.5 text-xs font-bold text-[var(--crm-heading)]">{module.confidence}% confidence</span>
                        </div>
                        <p className="mt-2 text-sm text-[var(--crm-text)]">{module.text}</p>
                        <p className="mt-2 text-xs text-[var(--crm-muted)]">{module.evidence}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          )}

          {activeView === 'care-ops' && (
            <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">Patient and Appointment Operations</h3>
                <p className="mt-1 text-sm text-[var(--crm-muted)]">Mapped to Patients, Appointments, PractitionerAvailability, PractitionerLeave and linked Cases.</p>
                <div className="mt-4 overflow-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.15em] text-[var(--crm-muted)]">
                        <th className="pb-2">Slot</th>
                        <th className="pb-2">Patient</th>
                        <th className="pb-2">Case</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careQueue.map((row) => (
                        <tr key={row.slot} className="border-t border-[var(--crm-border)]">
                          <td className="py-2 text-[var(--crm-heading)]">{row.slot}</td>
                          <td className="py-2">{row.patient}</td>
                          <td className="py-2">{row.linkedCase}</td>
                          <td className="py-2">
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">Program Enrollment Board</h3>
                <div className="mt-4 space-y-3 text-sm">
                  {[
                    '30-day Digestion Reset linked to CASE-2045',
                    '14-day Stress Recovery linked to CASE-2019',
                    'Program sessions auto-booked as PROGRAM_SESSION visits',
                    'CaseProgramMap maintains many-to-many lineage',
                  ].map((item) => (
                    <div key={item} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3 text-[var(--crm-text)]">{item}</div>
                  ))}
                </div>
              </article>
            </section>
          )}

          {activeView === 'knowledge' && (
            <section className="grid gap-4 xl:grid-cols-2">
              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">Tag and Condition Intelligence</h3>
                <p className="mt-1 text-sm text-[var(--crm-muted)]">TagDictionary, TagAliases, ContraDictionary, ConditionsMaster and ConditionTagIndex.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['ACIDITY', 'BLOATING', 'LATE_DINNER', 'HIGH_STRESS', 'DIGESTIVE_IMBALANCE', 'AGNI_LOW', 'VATA_AGGRAVATION'].map((tag) => (
                    <span key={tag} className="rounded-full border border-[var(--crm-border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--crm-heading)]">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    'Aliases map user input like "gas" and "acidity" to canonical tags.',
                    'ConditionTagIndex prefilters hypotheses in O(tags) runtime.',
                    'ContraDictionary powers safety pre-check before plan composition.',
                  ].map((line) => (
                    <div key={line} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3 text-sm text-[var(--crm-text)]">{line}</div>
                  ))}
                </div>
              </article>

              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">Endpoint to Table Contracts</h3>
                <div className="mt-4 space-y-3">
                  {endpointCoverage.map((item) => (
                    <div key={item.endpoint} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3">
                      <p className="text-sm font-bold text-[var(--crm-heading)]">{item.endpoint}</p>
                      <p className="mt-1 text-xs text-[var(--crm-muted)]"><span className="font-semibold text-[var(--crm-heading)]">Reads:</span> {item.reads}</p>
                      <p className="mt-1 text-xs text-[var(--crm-muted)]"><span className="font-semibold text-[var(--crm-heading)]">Writes:</span> {item.writes}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}

          {activeView === 'rules-engines' && (
            <section className="space-y-4">
              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">Rules and Components Console</h3>
                <p className="mt-1 text-sm text-[var(--crm-muted)]">Interpretation, AAHAR, VIHAR and AUSHADH engines with normalized conditions and outputs.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { title: 'Interpretation Rules', desc: 'InterpretationRules, InterpretationRuleConditions, InterpretationRuleOutputs' },
                    { title: 'Aahar Engine', desc: 'AaharRules, AaharRuleConditions, AaharRuleOutputs, AaharComponents' },
                    { title: 'Vihar and Yoga', desc: 'ViharRules, ViharRuleConditions, ViharRuleOutputs, ViharComponents, YogaProtocols' },
                    { title: 'Aushadh Engine', desc: 'AushadhRules, AushadhRuleConditions, AushadhRuleOutputs, AushadhComponents' },
                  ].map((card) => (
                    <div key={card.title} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3">
                      <p className="text-sm font-bold text-[var(--crm-heading)]">{card.title}</p>
                      <p className="mt-2 text-xs text-[var(--crm-muted)]">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">56-Table Planned Feature Coverage</h3>
                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  {featureCoverage.map((group) => (
                    <div key={group.domain} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3">
                      <p className="text-sm font-bold text-[var(--crm-heading)]">{group.domain}</p>
                      <p className="mt-1 text-xs text-[var(--crm-muted)]">{group.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.tables.map((table) => (
                          <span key={table} className="rounded-full border border-[var(--crm-border)] bg-white px-2 py-0.5 text-[11px] font-semibold text-[var(--crm-heading)]">{table}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}

          {activeView === 'safety-evidence' && (
            <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">Safety Filter and Contra Matrix</h3>
                <p className="mt-1 text-sm text-[var(--crm-muted)]">ComponentContraMap and ContraTagIndex block unsafe suggestions instantly.</p>
                <div className="mt-4 space-y-3 text-sm">
                  {[
                    'pregnancy_highrisk -> Block A-COMP-44, H-COMP-07',
                    'NUT_ALLERGY -> Warn for nut-based formulations',
                    'Red flags route case to supervisor and lock finalize action',
                  ].map((line) => (
                    <div key={line} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3 text-[var(--crm-text)]">{line}</div>
                  ))}
                </div>
              </article>

              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">Evidence Learning Lens</h3>
                <p className="mt-1 text-sm text-[var(--crm-muted)]">EvidenceComponentStats updates asynchronously from follow-up outcomes.</p>
                <div className="mt-4 overflow-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.15em] text-[var(--crm-muted)]">
                        <th className="pb-2">Component</th>
                        <th className="pb-2">N</th>
                        <th className="pb-2">Improvement</th>
                        <th className="pb-2">Side Effect</th>
                        <th className="pb-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evidenceRows.map((row) => (
                        <tr key={row.component} className="border-t border-[var(--crm-border)]">
                          <td className="py-2 font-semibold text-[var(--crm-heading)]">{row.component}</td>
                          <td className="py-2">{row.n}</td>
                          <td className="py-2">{row.avgImprovement}</td>
                          <td className="py-2">{row.sideEffectRate}</td>
                          <td className="py-2"><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">{row.score}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          )}

          {activeView === 'admin' && (
            <section className="grid gap-4 xl:grid-cols-2">
              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">Identity, Roles and Supervision</h3>
                <div className="mt-4 space-y-3">
                  {[
                    'Users with primary role and multi-role access from UserRoles.',
                    'Clinic-scoped memberships from UserClinicMap with owner/member split.',
                    'InternSupervisorMap controls approval chain per scope role.',
                    'CaseActors and CaseStatusHistory preserve medico-legal trail.',
                  ].map((line) => (
                    <div key={line} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3 text-sm text-[var(--crm-text)]">{line}</div>
                  ))}
                </div>
              </article>

              <article className="glass-panel rounded-2xl p-4 md:p-5">
                <h3 className="text-lg font-bold text-[var(--crm-heading)]">Settings and Secure Sessions</h3>
                <div className="mt-4 space-y-3">
                  {[
                    'SystemSettings for thresholds: EVIDENCE_MIN_N, generator version and feature flags.',
                    'ApiTokens for web and mobile sessions with expiry and revocation.',
                    'CaseFiles and TestAttachments for uploaded investigations with signed URLs.',
                    'Audit-friendly immutable headers for GeneratedPlanHeader and FinalPlanHeader.',
                  ].map((line) => (
                    <div key={line} className="rounded-xl border border-[var(--crm-border)] bg-white/80 p-3 text-sm text-[var(--crm-text)]">{line}</div>
                  ))}
                </div>
              </article>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
