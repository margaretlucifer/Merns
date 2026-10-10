import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { QuizItem } from '../types';
import { Brain, Clock, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizPortalPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const res = await api.getQuizzes();
        if (res.success) setQuizzes(res.quizzes);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  // Timer countdown when quiz is active and not submitted
  useEffect(() => {
    if (!activeQuiz || result) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuiz, result]);

  const handleStartQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      const res = await api.getQuizById(quizId);
      if (res.success) {
        setActiveQuiz(res.quiz);
        setAnswers({});
        setResult(null);
        setTimeLeft(res.quiz.timeLimitMinutes * 60);
      }
    } catch (err) {
      console.error('Failed to start quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (result) return;
    setAnswers({ ...answers, [questionId]: optionIdx });
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    try {
      setSubmitting(true);
      const res = await api.submitQuiz(activeQuiz.id, answers);
      if (res.success) {
        setResult(res);
        if (res.percentage >= 75) {
          confetti({ particleCount: 80, spread: 70 });
        }
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Quiz & Assessment Learning Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Timed course evaluations, conceptual MCQ self-assessments, and instant server-side grading.
          </p>
        </div>

        {activeQuiz && !result && (
          <div className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900 tabular-nums font-mono">
              Time Remaining: {formatTimer(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {!activeQuiz ? (
        /* Quiz Catalog */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {quiz.subject}
                </span>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{quiz.title}</h3>

                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quiz.timeLimitMinutes} Minutes Duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span className="tabular-nums">
                      {quiz.totalMarks} Marks · {quiz.questionsCount} Questions
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">By {quiz.authorName}</span>
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Active Quiz Assessment View */
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-indigo-600">{activeQuiz.subject}</span>
                <h2 className="text-lg font-bold text-slate-900">{activeQuiz.title}</h2>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Back to Quizzes
              </button>
            </div>

            {/* Questions list */}
            <div className="space-y-8">
              {activeQuiz.questions.map((q: any, qIdx: number) => {
                const reviewItem = result?.review?.find((r: any) => r.id === q.id);

                return (
                  <div key={q.id} className="space-y-3">
                    <div className="text-sm font-semibold text-slate-900 flex items-start gap-2">
                      <span className="tabular-nums text-indigo-600">Q{qIdx + 1}.</span>
                      <span>{q.question}</span>
                    </div>

                    <div className="space-y-2 pl-6">
                      {q.options.map((opt: string, optIdx: number) => {
                        const isSelected = answers[q.id] === optIdx;
                        let optionClass = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';

                        if (result) {
                          if (optIdx === reviewItem?.correctOption) {
                            optionClass = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold';
                          } else if (isSelected && !reviewItem?.isCorrect) {
                            optionClass = 'bg-rose-50 border-rose-300 text-rose-950 font-semibold';
                          }
                        } else if (isSelected) {
                          optionClass = 'bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={Boolean(result)}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${optionClass}`}
                          >
                            <span>{opt}</span>
                            {result && optIdx === reviewItem?.correctOption && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {result && isSelected && !reviewItem?.isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submit */}
                    {reviewItem && (
                      <div className="ml-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Faculty Explanation:</strong>
                        {reviewItem.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submission or Results Card */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              {!result ? (
                <>
                  <div className="text-xs text-slate-500">
                    Answered {Object.keys(answers).length} of {activeQuiz.questions.length} questions
                  </div>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-2.5 font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
                  >
                    {submitting ? 'Evaluating...' : 'Submit Assessment for Grading'}
                  </button>
                </>
              ) : (
                <div className="w-full p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-indigo-800">Assessment Completed</div>
                    <div className="text-xl font-extrabold text-indigo-950 tabular-nums">
                      Score: {result.score} / {result.totalMarks} ({result.percentage}%)
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setResult(null);
                      setAnswers({});
                      setTimeLeft(activeQuiz.timeLimitMinutes * 60);
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-800 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
