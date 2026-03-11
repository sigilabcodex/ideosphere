import type { LikertValue, QuestionDefinition, SupportedLanguage } from '../types/ideosphere';

interface Props {
  question: QuestionDefinition | undefined;
  answer: LikertValue | undefined;
  language: SupportedLanguage;
  onAnswer: (questionId: string, value: LikertValue) => void;
  onSkip: (questionId: string) => void;
}

const options: Array<{ label: string; value: LikertValue }> = [
  { label: 'Strongly disagree', value: -2 },
  { label: 'Disagree', value: -1 },
  { label: 'Neutral', value: 0 },
  { label: 'Agree', value: 1 },
  { label: 'Strongly agree', value: 2 },
];

export function QuestionCard({ question, answer, language, onAnswer, onSkip }: Props) {
  if (!question) return <div className="question-card">No questions available.</div>;

  return (
    <div className="question-card">
      <div className="tag-row">
        {question.visibleTags.map((tag) => (
          <span key={tag} className="tag-chip">{tag}</span>
        ))}
      </div>
      <h3>{question.text[language] || question.text.en}</h3>
      <div className="likert">
        {options.map((option) => (
          <button
            key={option.label}
            className={answer === option.value ? 'active' : ''}
            onClick={() => onAnswer(question.id, option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
        <button type="button" className="skip-button" onClick={() => onSkip(question.id)}>Skip</button>
      </div>
    </div>
  );
}
