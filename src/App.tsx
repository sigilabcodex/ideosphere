import { useMemo, useState } from 'react';
import { AxisSummary } from './components/AxisSummary';
import { IdeosphereCanvas } from './components/IdeosphereCanvas';
import { LayerToggle } from './components/LayerToggle';
import { QuestionCard } from './components/QuestionCard';
import { axes, questions } from './lib/data';
import { buildLayerProfile, deriveCloudParameters } from './lib/scoring';
import type { ActiveLayer, AnswerRecord, LikertValue } from './types/ideosphere';

function App() {
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('descriptive');
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [cursor, setCursor] = useState(0);

  const layerQuestions = useMemo(() => questions.filter((q) => q.layer === activeLayer), [activeLayer]);

  const profile = useMemo(
    () => buildLayerProfile(activeLayer, questions, answers, axes.map((axis) => axis.id)),
    [activeLayer, answers],
  );

  const cloud = useMemo(() => deriveCloudParameters(profile), [profile]);

  const question = layerQuestions[cursor % Math.max(layerQuestions.length, 1)];

  const onAnswer = (questionId: string, value: LikertValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { questionId, value } }));
    setCursor((prev) => (prev + 1) % Math.max(layerQuestions.length, 1));
  };

  const answeredCount = layerQuestions.filter((q) => answers[q.id]).length;

  return (
    <div className="app-shell">
      <aside className="panel left">
        <h1>Ideosphere</h1>
        <p>
          v0.01 local-first prototype for exploring ideological structure as a multidimensional probability field.
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
        <IdeosphereCanvas cloud={cloud} axes={axes} activeLayer={activeLayer} axisScores={profile.axisScores} />
      </main>

      <aside className="panel right">
        <QuestionCard question={question} answer={question ? answers[question.id]?.value : undefined} onAnswer={onAnswer} />
        <div className="profile-note">
          <h4>Profile state</h4>
          <p>
            The cloud centroid reflects your current directional tendency in the selected layer. Spread reflects
            coverage-driven uncertainty.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default App;
