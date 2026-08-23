"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { levels, type GameLevel, type HunchOption, type LevelId, type Scenario } from "../../data/scenarios";
import { clearGameProgress, loadGameProgress, saveGameProgress } from "../../lib/gameProgress";

function calculateRoundXp(scenarioXp: number, hunchWasCorrect: boolean, actionWasCorrect: boolean) {
  if (hunchWasCorrect && actionWasCorrect) return scenarioXp;
  if (hunchWasCorrect) return Math.round(scenarioXp * 0.6);
  if (actionWasCorrect) return Math.round(scenarioXp * 0.8);
  return Math.round(scenarioXp * 0.2);
}

function calculateStreakBonus(streak: number) {
  if (streak >= 5) return 50;
  if (streak === 4) return 30;
  if (streak === 3) return 20;
  if (streak === 2) return 10;
  return 0;
}

function formatRoundTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function GameBrand() {
  return (
    <Link className="game-brand" href="/" aria-label="Return to Hunch home">
      <span className="game-brand__mark">+</span>
      <span>HUNCH</span>
    </Link>
  );
}

function LevelSelection({ onSelect }: { onSelect: (levelId: LevelId) => void }) {
  return (
    <main className="game-page level-select-page">
      <div className="game-backdrop" aria-hidden="true" />
      <div className="game-vignette" aria-hidden="true" />
      <header className="level-select-header"><GameBrand /><span>CHOOSE YOUR HUNCH</span></header>
      <section className="level-select-content" aria-labelledby="level-select-title">
        <div className="game-kicker"><span>HUNCH // TRAINING MODES</span><span>60 SECONDS PER ROUND</span></div>
        <h1 id="level-select-title">Choose your<br /><em>level.</em></h1>
        <div className="level-cards">
          {levels.map((level) => (
            <article className={`level-card level-card--${level.id}`} key={level.id}>
              <div className="level-card__top"><span>LEVEL {level.number}</span><span>{level.difficulty}</span></div>
              <h2>{level.name}</h2><p>{level.description}</p>
              <div className="level-card__meta"><span><strong>{level.scenarioSet.length}</strong> rounds</span><span className="difficulty-dot">●</span></div>
              <button type="button" onClick={() => onSelect(level.id)}>Play <span>↗</span></button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Hud({ totalXp, streak, secondsLeft, roundNumber, scenarioCount }: { totalXp: number; streak: number; secondsLeft: number; roundNumber: number; scenarioCount: number }) {
  const timerState = secondsLeft <= 10 ? "is-critical" : secondsLeft <= 30 ? "is-warning" : "";

  return (
    <header className="game-hud">
      <GameBrand />
      <div className="game-hud__stats" aria-label="Round progress">
        <span>ROUND <b>{String(roundNumber).padStart(2, "0")}</b> <i>/ {scenarioCount}</i></span>
        <span className="hud-stat"><strong>⭐</strong> {totalXp} XP</span>
        <span className="hud-stat"><strong>🔥</strong> {streak}</span>
        <span className={`hud-timer ${timerState}`} role="timer" aria-live="polite" aria-label={`${secondsLeft} seconds remaining`}><strong>◷</strong> {secondsLeft}s</span>
      </div>
      <div className="progress-track" aria-label={`Round ${roundNumber} of ${scenarioCount}`}><span style={{ width: `${(roundNumber / scenarioCount) * 100}%` }} /></div>
    </header>
  );
}

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <article className="game-card" aria-labelledby="scenario-contact">
      <div className="game-card__topline"><span className="secure-dot" /> PRIVATE CHAT <span className="card-time">NOW</span></div>
      <div className="contact-row">
        <div className="contact-avatar">M</div>
        <div><h1 id="scenario-contact">{scenario.contactName}</h1><p>{scenario.category} · {scenario.difficulty}</p></div>
        <span className="contact-more">•••</span>
      </div>
      <div className="message-bubble">{scenario.message}</div>
      <div className="message-meta"><span>Delivered</span><span>♡</span></div>
      <div className="hunch-divider" />
      <p className="hunch-prompt">What&apos;s your hunch?</p>
      <p className="hunch-support">Read the room. Then trust your read.</p>
    </article>
  );
}

function ChoiceButton({ choice, selected, isLocked, onSelect }: { choice: HunchOption; selected: boolean; isLocked: boolean; onSelect: (id: HunchOption["id"]) => void }) {
  return (
    <button
      className={`hunch-choice hunch-choice--${choice.color}${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      disabled={isLocked}
      onClick={() => onSelect(choice.id)}
    >
      <span className="choice-icon">{choice.icon}</span>
      <span>{choice.label}</span>
      {selected && <span className="choice-check">✓</span>}
    </button>
  );
}

function StageProgress({ stage }: { stage: "hunch" | "action" | "reveal" }) {
  return (
    <div className="stage-progress" aria-label={`Current stage: ${stage}`}>
      <span className={stage === "hunch" ? "is-current" : "is-complete"}>HUNCH</span>
      <b>→</b>
      <span className={stage === "action" ? "is-current" : stage === "reveal" ? "is-complete" : ""}>ACTION</span>
      {stage === "reveal" && <><b>→</b><span className="is-current">REVEAL</span></>}
    </div>
  );
}

function ActionStage({ scenario, selectedHunch, selectedAction, onSelect, onFinalAnswer }: { scenario: Scenario; selectedHunch: HunchOption | null; selectedAction: string | null; onSelect: (id: string) => void; onFinalAnswer: () => void }) {
  return (
    <div className="action-stage stage-panel">
      <StageProgress stage="action" />
      <div className="your-hunch"><span>YOUR HUNCH</span><strong>{selectedHunch?.label ?? "No hunch locked in"}</strong></div>
      <div className="action-heading"><p className="eyebrow"><span>02</span> The next move is yours</p><h2>What would you do?</h2><p>Choose the safest way to verify what&apos;s really happening.</p></div>
      <div className="action-choices" role="group" aria-label="Action choices">
        {scenario.actionOptions.map((action) => (
          <button key={action.id} className={`action-choice${selectedAction === action.id ? " is-selected" : ""}`} type="button" aria-pressed={selectedAction === action.id} onClick={() => onSelect(action.id)}>
            <span className="action-letter">{action.letter}</span><span>{action.label}</span>{selectedAction === action.id && <span className="choice-check">✓</span>}
          </button>
        ))}
      </div>
      <div className="action-footer"><span className="timer is-paused"><span className="timer-ring" /> Timer paused</span><button className={`lock-button final-button${selectedAction ? " is-ready" : ""}`} type="button" disabled={!selectedAction} onClick={onFinalAnswer}>Final answer <span>↗</span></button></div>
    </div>
  );
}

function RevealStage({ scenario, selectedHunch, selectedAction, hunchWasCorrect, actionWasCorrect, baseRoundXp, streakBonus, roundXp, totalXp, currentStreak, isLastRound, onNextRound }: { scenario: Scenario; selectedHunch: HunchOption | null; selectedAction: string | null; hunchWasCorrect: boolean; actionWasCorrect: boolean; baseRoundXp: number; streakBonus: number; roundXp: number; totalXp: number; currentStreak: number; isLastRound: boolean; onNextRound: () => void }) {
  const correctAction = scenario.actionOptions.find((action) => action.id === scenario.correctAction);
  const selectedActionLabel = scenario.actionOptions.find((action) => action.id === selectedAction)?.label ?? "No action selected";

  return (
    <div className="reveal-stage stage-panel">
      <StageProgress stage="reveal" />
      <div className="reveal-badge">✓ CASE REVEALED</div>
      <h2>{actionWasCorrect && hunchWasCorrect ? "Good hunch." : hunchWasCorrect ? "Good instinct." : actionWasCorrect ? "Good recovery." : "Trust the lesson."}</h2>
      <p className="reveal-result">{actionWasCorrect && hunchWasCorrect ? "You chose the safest way to check in." : hunchWasCorrect ? "You spotted the signal, but there was a safer next step." : actionWasCorrect ? "Your action was safe, even though your first read missed the signal." : "Every decision is practice. Here is what to notice next time."}</p>
      <div className="answer-review"><div className={hunchWasCorrect ? "is-correct" : "is-incorrect"}><span>YOUR HUNCH</span><strong>{selectedHunch?.label ?? "No hunch locked in"}</strong><em>{hunchWasCorrect ? "✓ Correct" : "× Not quite"}</em></div><div><span>CORRECT HUNCH</span><strong>{scenario.hunchOptions.find((choice) => choice.id === scenario.correctHunch)?.label}</strong></div><div className={actionWasCorrect ? "is-correct" : "is-incorrect"}><span>YOUR ACTION</span><strong>{selectedActionLabel}</strong><em>{actionWasCorrect ? "✓ Correct" : "× Not quite"}</em></div><div><span>CORRECT ACTION</span><strong>{correctAction?.label}</strong></div></div>
      <div className="reveal-explanation">{scenario.explanation}</div>
      <div className="red-flags"><h3>Red flags</h3>{scenario.redFlags.length > 0 ? <ul>{scenario.redFlags.map((flag) => <li key={flag}>{flag}</li>)}</ul> : <p className="no-red-flags">No unusual warning signs detected.</p>}</div>
      <div className="trust-lesson"><span>TRUST LESSON</span>{scenario.trustLesson}</div>
      <div className="xp-breakdown"><div><span>BASE XP</span><strong>+{baseRoundXp}</strong></div><div><span>🔥 STREAK BONUS</span><strong>+{streakBonus}</strong></div><div className="xp-breakdown__total"><span>TOTAL</span><strong>+{roundXp} XP</strong></div></div><div className="reveal-streak">CURRENT STREAK <strong>🔥 {currentStreak}</strong></div>
      <div className="reveal-total">TOTAL XP <strong>{totalXp}</strong></div>
      <button className="next-round" type="button" onClick={onNextRound}>{isLastRound ? "View scorecard" : "Next round"} <span>→</span></button>
    </div>
  );
}

function performanceMessage(correctHunches: number, roundCount: number) {
  const accuracy = correctHunches / roundCount;
  if (accuracy >= 0.8) return "Your instincts are getting sharper.";
  if (accuracy >= 0.5) return "You are learning to pause and read the signals.";
  return "Every round gives your judgment more data.";
}

function Scoreboard({ level, levelXp, totalXp, levelCorrectDecisions, levelCorrectHunches, overallCorrectDecisions, bestStreak, levelsCompleted, isFinal, onNextLevel, onTryAgain }: { level: GameLevel; levelXp: number; totalXp: number; levelCorrectDecisions: number; levelCorrectHunches: number; overallCorrectDecisions: number; bestStreak: number; levelsCompleted: number; isFinal: boolean; onNextLevel: () => void; onTryAgain: () => void }) {
  const roundCount = level.scenarioSet.length;
  const levelAccuracy = Math.round((levelCorrectHunches / roundCount) * 100);
  const overallRoundCount = levels.length * roundCount;
  const overallAccuracy = Math.round((overallCorrectDecisions / overallRoundCount) * 100);

  return (
    <div className={`scoreboard-stage stage-panel${isFinal ? " is-final" : ""}`}>
      <div className="reveal-badge">✓ {isFinal ? "ALL LEVELS REVIEWED" : `${level.name} COMPLETE`}</div>
      <p className="scoreboard-kicker">{isFinal ? "YOUR HUNCH RESULTS" : "LEVEL COMPLETE!"}</p>
      <h2>{isFinal ? "Your Hunch Results" : level.name}</h2>
      {isFinal ? <>
        <div className="scoreboard-stats"><div><span>TOTAL XP</span><strong>{totalXp}</strong></div><div><span>OVERALL ACCURACY</span><strong>{overallAccuracy}%</strong></div><div><span>TOTAL CORRECT</span><strong>{overallCorrectDecisions} / {overallRoundCount}</strong></div><div><span>BEST STREAK</span><strong>🔥 {bestStreak}</strong></div><div><span>LEVELS COMPLETED</span><strong>{levelsCompleted} / {levels.length}</strong></div></div>
        <p className="scoreboard-message">{performanceMessage(overallCorrectDecisions, overallRoundCount)}</p>
      </> : <>
        <div className="scoreboard-highlight">+{levelXp} XP <span>THIS LEVEL</span></div>
        <div className="scoreboard-stats"><div><span>CORRECT DECISIONS</span><strong>{levelCorrectDecisions} / {roundCount}</strong></div><div><span>HUNCH ACCURACY</span><strong>{levelAccuracy}%</strong></div><div><span>BEST STREAK</span><strong>🔥 {bestStreak}</strong></div><div><span>TOTAL XP</span><strong>{totalXp}</strong></div></div>
        <p className="scoreboard-message">{performanceMessage(levelCorrectHunches, roundCount)}</p>
      </>}
      <div className="scoreboard-actions">{isFinal ? <button className="next-round is-ready" type="button" onClick={onTryAgain}>Try again <span>↗</span></button> : <button className="next-round is-ready" type="button" onClick={onNextLevel}>Next level <span>→</span></button>}<Link className="scoreboard-home" href="/">Home</Link></div>
    </div>
  );
}

export default function GameplayScreen() {
  const [selectedLevelId, setSelectedLevelId] = useState<LevelId | null>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<HunchOption["id"] | null>(null);
  const [stage, setStage] = useState<"hunch" | "action" | "reveal" | "scoreboard">("hunch");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [roundXp, setRoundXp] = useState(0);
  const [baseRoundXp, setBaseRoundXp] = useState(0);
  const [streakBonus, setStreakBonus] = useState(0);
  const [levelXp, setLevelXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctDecisions, setCorrectDecisions] = useState(0);
  const [levelCorrectHunches, setLevelCorrectHunches] = useState(0);
  const [levelCorrectDecisions, setLevelCorrectDecisions] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [timedOut, setTimedOut] = useState(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const selectedLevel = levels.find((level) => level.id === selectedLevelId) ?? null;
  const currentScenario = selectedLevel?.scenarioSet[scenarioIndex] ?? null;

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const savedProgress = loadGameProgress();
      const isNewGame = window.location.search === "?new=1";
      if (savedProgress && !isNewGame) {
        setSelectedLevelId(savedProgress.currentLevel);
        setScenarioIndex(savedProgress.currentRound);
        setTotalXp(savedProgress.totalXP);
        setStreak(savedProgress.currentStreak);
        setBestStreak(savedProgress.bestStreak);
        setCorrectDecisions(savedProgress.correctAnswers);
        setCompletedLevels(savedProgress.completedLevels);
        setSelectedChoice(savedProgress.selectedChoice as HunchOption["id"] | null);
        setSelectedAction(savedProgress.selectedAction);
        setRoundXp(savedProgress.roundXP);
        setBaseRoundXp(savedProgress.baseRoundXP);
        setStreakBonus(savedProgress.streakBonus);
        setLevelXp(savedProgress.levelXP);
        setLevelCorrectHunches(savedProgress.levelCorrectHunches);
        setLevelCorrectDecisions(savedProgress.levelCorrectDecisions);
        setStage(savedProgress.stage);
      }
      if (isNewGame) {
        clearGameProgress();
        setSelectedLevelId(levels[0].id);
        setScenarioIndex(0);
        setStage("hunch");
      }
      setSecondsLeft(60);
      setTimedOut(false);
      setHasLoadedProgress(true);
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!hasLoadedProgress || !selectedLevelId) return;
    saveGameProgress({
      currentLevel: selectedLevelId,
      currentRound: scenarioIndex,
      totalXP: totalXp,
      currentStreak: streak,
      bestStreak,
      correctAnswers: correctDecisions,
      completedLevels,
      gameStatus: selectedLevelId === levels[levels.length - 1].id && stage === "scoreboard" ? "completed" : "active",
      stage,
      selectedChoice,
      selectedAction,
      roundXP: roundXp,
      baseRoundXP: baseRoundXp,
      streakBonus,
      levelXP: levelXp,
      levelCorrectHunches,
      levelCorrectDecisions,
    });
  }, [hasLoadedProgress, selectedLevelId, scenarioIndex, totalXp, streak, bestStreak, correctDecisions, completedLevels, stage, selectedChoice, selectedAction, roundXp, baseRoundXp, streakBonus, levelXp, levelCorrectHunches, levelCorrectDecisions]);

  useEffect(() => {
    if (stage !== "hunch" || timedOut || !selectedLevelId) return;

    const timerId = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => {
        if (currentSeconds <= 1) {
          setTimedOut(true);
          return 0;
        }
        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [stage, timedOut, scenarioIndex, selectedLevelId]);

  if (!hasLoadedProgress) {
    return null;
  }

  if (!selectedLevelId) {
    return <LevelSelection onSelect={(levelId) => { setSelectedLevelId(levelId); setScenarioIndex(0); setSecondsLeft(60); setTimedOut(false); setStage("hunch"); }} />;
  }

  if (!selectedLevel || !currentScenario) {
    return <main className="game-page"><div className="completion-stage stage-panel"><h2>Scenario unavailable</h2><p>We could not load this case. Please return to level selection.</p><button className="next-round is-ready" type="button" onClick={() => setSelectedLevelId(null)}>Choose level</button></div></main>;
  }

  const activeScenario = currentScenario;

  const selectedHunch = activeScenario.hunchOptions.find((choice) => choice.id === selectedChoice) ?? null;
  const hunchWasCorrect = selectedChoice !== null && selectedChoice === activeScenario.correctHunch;
  const actionWasCorrect = selectedAction === activeScenario.correctAction;

  function resetRoundState(nextIndex: number) {
    setScenarioIndex(nextIndex);
    setSelectedChoice(null);
    setSelectedAction(null);
    setRoundXp(0);
    setBaseRoundXp(0);
    setStreakBonus(0);
    setSecondsLeft(60);
    setTimedOut(false);
    setStage("hunch");
  }

  function handleFinalAnswer() {
    const earnedBaseXp = calculateRoundXp(activeScenario.baseXP, hunchWasCorrect, actionWasCorrect);
    const nextStreak = actionWasCorrect && hunchWasCorrect ? streak + 1 : 0;
    const earnedStreakBonus = calculateStreakBonus(nextStreak);
    const earnedXp = earnedBaseXp + earnedStreakBonus;
    setBaseRoundXp(earnedBaseXp);
    setStreakBonus(earnedStreakBonus);
    setRoundXp(earnedXp);
    setTotalXp((currentTotal) => currentTotal + earnedXp);
    setLevelXp((currentLevelXp) => currentLevelXp + earnedXp);
    setStreak(nextStreak);
    setBestStreak((currentBest) => Math.max(currentBest, nextStreak));
    setCorrectDecisions((currentCount) => hunchWasCorrect && actionWasCorrect ? currentCount + 1 : currentCount);
    setLevelCorrectHunches((currentCount) => hunchWasCorrect ? currentCount + 1 : currentCount);
    setLevelCorrectDecisions((currentCount) => hunchWasCorrect && actionWasCorrect ? currentCount + 1 : currentCount);
    setStage("reveal");
  }

  function handleNextRound() {
    if (selectedLevel && scenarioIndex < selectedLevel.scenarioSet.length - 1) resetRoundState(scenarioIndex + 1);
  }

  function handlePlayAgain() {
    clearGameProgress();
    setTotalXp(0);
    setStreak(0);
    setCorrectDecisions(0);
    setCompletedLevels([]);
    setBestStreak(0);
    setLevelXp(0);
    setLevelCorrectHunches(0);
    setLevelCorrectDecisions(0);
    setSelectedLevelId(levels[0].id);
    resetRoundState(0);
  }

  function handleLevelComplete() {
    if (!selectedLevel) return;
    setCompletedLevels((currentLevels) => currentLevels.includes(selectedLevel.number) ? currentLevels : [...currentLevels, selectedLevel.number]);
    setStage("scoreboard");
  }

  return (
    <main className="game-page">
      <div className="game-backdrop" aria-hidden="true" />
      <div className="game-vignette" aria-hidden="true" />
      <Hud totalXp={totalXp} streak={streak} secondsLeft={stage === "hunch" ? secondsLeft : 0} roundNumber={scenarioIndex + 1} scenarioCount={selectedLevel.scenarioSet.length} />
      <div className="game-content">
        <div className="game-kicker"><span>CASE FILE {String(scenarioIndex + 1).padStart(3, "0")}</span><span>{selectedLevel.name} · {activeScenario.category.toUpperCase()} · {activeScenario.difficulty.toUpperCase()}</span></div>
        {stage === "scoreboard" ? <Scoreboard level={selectedLevel} levelXp={levelXp} totalXp={totalXp} levelCorrectDecisions={levelCorrectDecisions} levelCorrectHunches={levelCorrectHunches} overallCorrectDecisions={correctDecisions} bestStreak={bestStreak} levelsCompleted={completedLevels.length} isFinal={selectedLevel.number === levels.length} onNextLevel={() => { const nextLevel = levels[selectedLevel.number]; if (nextLevel) { setLevelXp(0); setLevelCorrectHunches(0); setLevelCorrectDecisions(0); setSelectedLevelId(nextLevel.id); resetRoundState(0); } }} onTryAgain={handlePlayAgain} /> : <div className={`game-stage${stage !== "hunch" ? ` is-${stage}` : ""}`}>
          <div className="scenario-wrap">
            {stage === "hunch" && <><StageProgress stage="hunch" /><ScenarioCard scenario={activeScenario} /><div className="choice-panel"><div className="choices" role="group" aria-label="Hunch choices">{activeScenario.hunchOptions.map((choice) => <ChoiceButton key={choice.id} choice={choice} selected={selectedChoice === choice.id} isLocked={timedOut} onSelect={setSelectedChoice} />)}</div><div className="lock-row"><span className={`timer ${secondsLeft <= 10 ? "is-critical" : secondsLeft <= 30 ? "is-warning" : ""}`}><span className="timer-ring" /> {formatRoundTime(secondsLeft)}</span>{timedOut ? <button className="lock-button is-ready" type="button" onClick={() => setStage("action")}>Continue <span>→</span></button> : <button className={`lock-button${selectedChoice ? " is-ready" : ""}`} type="button" disabled={!selectedChoice} onClick={() => setStage("action")}>Lock in <span>↗</span></button>}</div>{timedOut && <div className="timeout-message" role="alert"><strong>TIME&apos;S UP!</strong><span>Your hunch was not locked in. Continue when you&apos;re ready.</span></div>}</div></>}
            {stage === "action" && <ActionStage scenario={activeScenario} selectedHunch={selectedHunch} selectedAction={selectedAction} onSelect={setSelectedAction} onFinalAnswer={handleFinalAnswer} />}
            {stage === "reveal" && <RevealStage scenario={activeScenario} selectedHunch={selectedHunch} selectedAction={selectedAction} hunchWasCorrect={hunchWasCorrect} actionWasCorrect={actionWasCorrect} baseRoundXp={baseRoundXp} streakBonus={streakBonus} roundXp={roundXp} totalXp={totalXp} currentStreak={streak} isLastRound={scenarioIndex === selectedLevel.scenarioSet.length - 1} onNextRound={() => { if (scenarioIndex === selectedLevel.scenarioSet.length - 1) handleLevelComplete(); else handleNextRound(); }} />}
          </div>
        </div>}
        {stage === "hunch" && <p className="game-note"><span>TIP</span> Your first instinct is data. Your second thought is the test.</p>}
      </div>
      <footer className="game-footer"><span>HUNCH // TRUST DECISION SIMULATOR</span><span>{String(scenarioIndex + 1).padStart(2, "0")} — {String(selectedLevel.scenarioSet.length).padStart(2, "0")}</span></footer>
    </main>
  );
}
