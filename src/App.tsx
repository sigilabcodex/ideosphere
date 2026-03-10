import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEventHandler } from 'react';
import { AxisSummary } from './components/AxisSummary';
import { IdeosphereCanvas } from './components/IdeosphereCanvas';
import { LayerToggle } from './components/LayerToggle';
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
import { buildProfiles, deriveCloudParameters } from './lib/scoring';
import type { ActiveLayer, AnswerRecord, LikertValue } from './types/ideosphere';

function App() {
  const [loadedProfile] = useState(() => loadProfileFromStorage());
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('descriptive');
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>(
    loadedProfile.profile ? serializedAnswersToAnswerRecords(loadedProfile.profile.answers) : {},
  );
  const [cursor, setCursor] = useState(0);
  const [status, setStatus] = useState<string | null>(loadedProfile.error ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const layerQuestions = useMemo(() => questions.filter((q) => q.layer === activeLayer), [activeLayer]);
  const allProfiles = useMemo(
    () => buildProfiles(questions, answers, axes.map((axis) => axis.id)),
    [answers],
  );

  const profile = allProfiles[activeLayer];

  const cloud = useMemo(() => deriveCloudParameters(profile), [profile]);

  const question = layerQuestions[cursor % Math.max(layerQuestions.length, 1)];

  const onAnswer = (questionId: string, value: LikertValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { questionId, value } }));
    setCursor((prev) => (prev + 1) % Math.max(layerQuestions.length, 1));
  };

  const answeredCount = layerQuestions.filter((q) => answers[q.id]).length;

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
        <LayerToggle activeLayer={activeLayer} onChange={(layer) => { setActiveLayer(layer); setCursor(0); }} />
        <div className="stats">
          <div><span>Coverage</span><strong>{Math.round(profile.coverage * 100)}%</strong></div>
          <div><span>Uncertainty</span><strong>{Math.round(profile.uncertainty * 100)}%</strong></div>
          <div><span>Answered ({activeLayer})</span><strong>{answeredCount}/{layerQuestions.length}</strong></div>
        </div>
        <AxisSummary axes={axes} profile={profile} />
      </aside>

      <main className="center-stage">
        <IdeosphereCanvas cloud={cloud} axes={axes} />
      </main>

      <aside className="panel right">
        <QuestionCard question={question} answer={question ? answers[question.id]?.value : undefined} onAnswer={onAnswer} />
        <div className="profile-note">
          <h4>Profile state</h4>
          <p>
            The cloud centroid reflects your current directional tendency in the selected layer. Spread reflects
            coverage-driven uncertainty.
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
