'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PEOPLE = ['원우', '상윤', '재경', '지영', '윤경', '승훈'] as const;
type Person = (typeof PEOPLE)[number];

interface ScoreLog {
  id: string;
  person: Person;
  score: number;
  timestamp: number;
}

interface ScoreData {
  scores: Record<Person, number>;
  logs: ScoreLog[];
}

const STORAGE_KEY = 'score-manager-data';

export default function ScoreManagerPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [scoreInput, setScoreInput] = useState('');
  const [scoreData, setScoreData] = useState<ScoreData>(() => {
    if (typeof window === 'undefined') {
      return {
        scores: {
          원우: 0,
          상윤: 0,
          재경: 0,
          지영: 0,
          윤경: 0,
          승훈: 0,
        },
        logs: [],
      };
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 기존 데이터에 승훈이 없으면 추가
        if (!parsed.scores || !('승훈' in parsed.scores)) {
          parsed.scores = { ...parsed.scores, 승훈: 0 };
        }
        return parsed;
      } catch {
        // 파싱 실패 시 기본값 반환
      }
    }
    return {
      scores: {
        원우: 0,
        상윤: 0,
        재경: 0,
        지영: 0,
        윤경: 0,
      },
      logs: [],
    };
  });

  // localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scoreData));
  }, [scoreData]);

  const togglePerson = useCallback((person: Person) => {
    setSelectedPeople((prev) =>
      prev.includes(person)
        ? prev.filter((p) => p !== person)
        : [...prev, person],
    );
  }, []);

  const handleSubmit = useCallback(() => {
    const score = parseFloat(scoreInput);
    if (isNaN(score) || selectedPeople.length === 0) {
      return;
    }

    const newLogs: ScoreLog[] = selectedPeople.map((person) => ({
      id: `${Date.now()}-${person}-${Math.random()}`,
      person,
      score,
      timestamp: Date.now(),
    }));

    setScoreData((prev) => {
      const newScores = { ...prev.scores };
      selectedPeople.forEach((person) => {
        newScores[person] = (newScores[person] || 0) + score;
      });

      return {
        scores: newScores,
        logs: [...newLogs, ...prev.logs],
      };
    });

    setScoreInput('');
    setSelectedPeople([]);
  }, [scoreInput, selectedPeople]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">점수 관리</h1>

        {/* 점수 표시 */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PEOPLE.map((person) => (
            <Card key={person}>
              <CardHeader>
                <CardTitle>{person}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {scoreData.scores[person] || 0}점
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 로그 표시 */}
        {scoreData.logs.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>점수 로그</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {scoreData.logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.person}</span>
                      <span className="text-muted-foreground">
                        +{log.score}점
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating 버튼 */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={cn(
          'bg-primary text-primary-foreground fixed right-8 bottom-8 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110',
          isPanelOpen && 'rotate-45',
        )}
      >
        {isPanelOpen ? <X className="size-6" /> : <Plus className="size-6" />}
      </button>

      {/* 점수 입력 패널 */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>점수 추가</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 이름 선택 */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  이름 선택
                </label>
                <div className="flex flex-wrap gap-2">
                  {PEOPLE.map((person) => (
                    <button
                      key={person}
                      onClick={() => togglePerson(person)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm transition-colors',
                        selectedPeople.includes(person)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80',
                      )}
                    >
                      {person}
                    </button>
                  ))}
                </div>
              </div>

              {/* 점수 입력 */}
              <div>
                <label className="mb-2 block text-sm font-medium">점수</label>
                <Input
                  type="number"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  placeholder="점수를 입력하세요"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
              </div>

              {/* 제출 버튼 */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={selectedPeople.length === 0 || !scoreInput}
                  className="flex-1"
                >
                  추가
                </Button>
                <Button onClick={() => setIsPanelOpen(false)} variant="outline">
                  닫기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
