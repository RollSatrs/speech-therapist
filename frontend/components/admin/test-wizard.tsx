"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Answer = {
  id?: number;
  textRu: string;
  textKz: string;
  textEn?: string;
  points: number;
};

type Question = {
  id?: number;
  textRu: string;
  textKz: string;
  textEn?: string;
  answers: Answer[];
};

export type TestForm = {
  name: string;
  ageFrom: number;
  ageTo: number;
  questions: Question[];
};

const steps = ["Название", "Возраст", "Вопросы", "Проверка"] as const;

const emptyAnswer = (): Answer => ({
  textRu: "",
  textKz: "",
  textEn: "",
  points: 0,
});

const emptyQuestion = (): Question => ({
  textRu: "",
  textKz: "",
  textEn: "",
  answers: [emptyAnswer(), emptyAnswer(), emptyAnswer()],
});

export function TestWizard({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: TestForm;
  onSubmit: (data: TestForm) => Promise<void>;
  submitLabel: string;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<TestForm>(
    initial ?? {
      name: "",
      ageFrom: 2,
      ageTo: 3,
      questions: [emptyQuestion()],
    }
  );
  const [saving, setSaving] = useState(false);

  const canNext = useMemo(() => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 1) return form.ageFrom > 0 && form.ageTo >= form.ageFrom;
    if (step === 2)
      return form.questions.every(
        (q) =>
          q.textRu.trim() &&
          q.textKz.trim() &&
          q.answers.every((a) => a.textRu.trim() && a.textKz.trim())
      );
    return true;
  }, [form, step]);

  async function handleSubmit() {
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div className="space-y-6">
        <div className="text-xs uppercase tracking-[0.35em] text-foreground/60">
          Конструктор
        </div>
        <div className="space-y-4">
          {steps.map((label, index) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs",
                  index === step
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/30 text-foreground/60"
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "text-sm",
                  index === step ? "font-semibold" : "text-foreground/60"
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-foreground/10 bg-muted/60 p-4 text-xs text-foreground/60">
          Каждый тест — это сценарий для реального звонка родителям. Чем точнее
          вопрос, тем сильнее лид.
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 ? (
            <div className="space-y-2">
              <Label>Название теста</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Скрининг речи 3–4 года"
              />
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Возраст от</Label>
                <Input
                  type="number"
                  value={form.ageFrom}
                  onChange={(e) =>
                    setForm({ ...form, ageFrom: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Возраст до</Label>
                <Input
                  type="number"
                  value={form.ageTo}
                  onChange={(e) =>
                    setForm({ ...form, ageTo: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-8">
              {form.questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="rounded-2xl border border-foreground/10 bg-muted/40 p-5"
                >
                  <div className="mb-4 text-xs uppercase tracking-[0.3em] text-foreground/60">
                    Вопрос {qIndex + 1}
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Вопрос (RU)</Label>
                      <Textarea
                        value={q.textRu}
                        onChange={(e) => {
                          const questions = [...form.questions];
                          questions[qIndex].textRu = e.target.value;
                          setForm({ ...form, questions });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Вопрос (KZ)</Label>
                      <Textarea
                        value={q.textKz}
                        onChange={(e) => {
                          const questions = [...form.questions];
                          questions[qIndex].textKz = e.target.value;
                          setForm({ ...form, questions });
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-5 space-y-4">
                    {q.answers.map((a, aIndex) => (
                      <div
                        key={aIndex}
                        className="grid gap-4 rounded-xl border border-foreground/10 bg-background/80 p-4 lg:grid-cols-[1fr_1fr_120px]"
                      >
                        <div className="space-y-2">
                          <Label>Ответ (RU)</Label>
                          <Input
                            value={a.textRu}
                            onChange={(e) => {
                              const questions = [...form.questions];
                              questions[qIndex].answers[aIndex].textRu =
                                e.target.value;
                              setForm({ ...form, questions });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ответ (KZ)</Label>
                          <Input
                            value={a.textKz}
                            onChange={(e) => {
                              const questions = [...form.questions];
                              questions[qIndex].answers[aIndex].textKz =
                                e.target.value;
                              setForm({ ...form, questions });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Баллы</Label>
                          <Input
                            type="number"
                            value={a.points}
                            onChange={(e) => {
                              const questions = [...form.questions];
                              questions[qIndex].answers[aIndex].points = Number(
                                e.target.value
                              );
                              setForm({ ...form, questions });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const questions = [...form.questions];
                        questions[qIndex].answers.push(emptyAnswer());
                        setForm({ ...form, questions });
                      }}
                    >
                      + Добавить вариант ответа
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setForm({ ...form, questions: [...form.questions, emptyQuestion()] })
                }
              >
                + Добавить вопрос
              </Button>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4 text-sm text-foreground/70">
              <div className="rounded-2xl border border-foreground/10 bg-muted/40 p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Резюме
                </div>
                <div className="mt-3 space-y-1">
                  <div>Название: {form.name}</div>
                  <div>
                    Возраст: {form.ageFrom} – {form.ageTo}
                  </div>
                  <div>Вопросов: {form.questions.length}</div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0}
            >
              Назад
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((prev) => prev + 1)} disabled={!canNext}>
                Далее
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canNext || saving}>
                {saving ? "Сохраняем..." : submitLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
