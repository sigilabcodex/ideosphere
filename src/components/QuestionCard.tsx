import type { LikertValue, QuestionDefinition } from '../types/ideosphere';

interface Props {
  question: QuestionDefinition | undefined;
  answer: LikertValue | undefined;
  onAnswer: (questionId: string, value: LikertValue) => void;
}

const options: Array<{ label: string; value: LikertValue }> = [
  { label: 'Strongly disagree', value: -2 },
  { label: 'Disagree', value: -1 },
  { label: 'Neutral', value: 0 },
  { label: 'Agree', value: 1 },
  { label: 'Strongly agree', value: 2 },
];

export function QuestionCard({ question, answer, onAnswer }: Props) {
  if (!question) return <div className="question-card">No questions in this layer.</div>;

  return (
    <div className="question-card">
      <p className="meta">{question.family} · {question.abstractionLevel}</p>
      <h3>{question.text}</h3>
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
      </div>
    </div>
  );
}
