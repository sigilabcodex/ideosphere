import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEventHandler } from 'react';
import { AxisSummary } from './components/AxisSummary';
import { IdeosphereCanvas } from './components/IdeosphereCanvas';
import { QuestionCard } from './components/QuestionCard';
import { axes, questions } from './lib/data';
import {
  clearStoredProfile,
  createSerializedProfile,
  downloadProfile,
  isSerializedProfile,
  loadProfileFromStorage,
  saveProfileToStorage,
  serializedAnswersToAnswerRecords,
} from './lib/persistence';
import { buildLayerProfile, buildProfiles, deriveCloudParameters } from './lib/scoring';
import type { AnswerRecord, LikertValue, SupportedLanguage } from './types/ideosphere';

function App() {
  const [loadedProfile] = useState(() => loadProfileFromStorage());
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>(
    loadedProfile.profile ? serializedAnswersToAnswerRecords(loadedProfile.profile.answers) : {},
  );
  const [cursor, setCursor] = useState(0);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [status, setStatus] = useState<string | null>(loadedProfile.error ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allProfiles = useMemo(
    () => buildProfiles(questions, answers, axes.map((axis) => axis.id)),
    [answers],
  );

  const unifiedProfile = useMemo(
    () => buildLayerProfile('unified', questions, answers, axes.map((axis) => axis.id)),
    [answers],
  );

  const cloud = useMemo(() => deriveCloudParameters(unifiedProfile), [unifiedProfile]);

  const question = questions[cursor % Math.max(questions.length, 1)];

  const onAdvance = () => {
    setCursor((prev) => (prev + 1) % Math.max(questions.length, 1));
  };

  const onAnswer = (questionId: string, value: LikertValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { questionId, value } }));
    onAdvance();
  };

  const onSkip = () => {
    onAdvance();
  };

  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const axisCoverage = axes.filter((axis) =>
    questions.some((q) => answers[q.id] && q.axisImpacts.some((impact) => impact.axisId === axis.id))).length;
  const profileClarity = Math.round((1 - unifiedProfile.uncertainty) * 100);

  useEffect(() => {
    saveProfileToStorage(createSerializedProfile(answers, allProfiles));
  }, [answers, allProfiles]);

  const onExportProfile = () => {
    downloadProfile(createSerializedProfile(answers, allProfiles));
    setStatus('Profile exported.');
  };

  const onImportClick = () => {
    fileInputRef.current?.click();
  };

  const onImportProfile: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const raw = await file.text();
      const parsed: unknown = JSON.parse(raw);

      if (!isSerializedProfile(parsed)) {
        setStatus('Import rejected: malformed or incompatible profile schema/version.');
        return;
      }

      const importedAnswers = serializedAnswersToAnswerRecords(parsed.answers);
      setAnswers(importedAnswers);
      setCursor(0);
      setStatus('Profile imported successfully.');
    } catch {
      setStatus('Import rejected: invalid JSON.');
    }
  };

  const onResetProfile = () => {
    setAnswers({});
    setCursor(0);
    clearStoredProfile();
    setStatus('Profile reset.');
  };

  return (
    <div className="app-shell">
      <aside className="panel left">
        <h1>Ideosphere</h1>
        <p>
          v0.02 local-first prototype for exploring ideological structure as a multidimensional probability field.
        </p>
        <div className="language-toggle">
          <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
          <button type="button" className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
        </div>
        <div className="stats">
          <div><span>Exploration</span><strong>{Math.round((answeredCount / questions.length) * 100)}%</strong></div>
          <div><span>Profile clarity</span><strong>{profileClarity}%</strong></div>
          <div><span>Axis coverage</span><strong>{axisCoverage}/{axes.length}</strong></div>
        </div>
        <AxisSummary axes={axes} profile={unifiedProfile} />
      </aside>

      <main className="center-stage">
        <IdeosphereCanvas cloud={cloud} axes={axes} />
      </main>

      <aside className="panel right">
        <QuestionCard
          question={question}
          answer={question ? answers[question.id]?.value : undefined}
          language={language}
          onAnswer={onAnswer}
          onSkip={onSkip}
        />
        <div className="profile-note">
          <h4>Unified field state</h4>
          <p>
            All questions feed one sphere. Layer differences are tracked internally and folded into the same
            ideological field estimate.
          </p>
          <div className="profile-controls">
            <button type="button" onClick={onExportProfile}>Export Profile</button>
            <button type="button" onClick={onImportClick}>Import Profile</button>
            <button type="button" onClick={onResetProfile}>Reset Profile</button>
            <input ref={fileInputRef} type="file" accept="application/json" onChange={onImportProfile} hidden />
          </div>
          {status && <p className="profile-status">{status}</p>}
        </div>
      </aside>
    </div>
  );
}

export default App;
