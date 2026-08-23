"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearGameProgress, loadGameProgress, type SavedGameProgress } from "../lib/gameProgress";
import { levels } from "../data/scenarios";

export default function Home() {
  const [savedProgress, setSavedProgress] = useState<SavedGameProgress | null>(null);
  const [isConfirmingNewGame, setIsConfirmingNewGame] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => setSavedProgress(loadGameProgress()), 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  const savedLevel = savedProgress ? levels.find((level) => level.id === savedProgress.currentLevel) : null;
  const isCompleted = savedProgress?.gameStatus === "completed";

  function handleNewGame() {
    clearGameProgress();
    setSavedProgress(null);
    setIsConfirmingNewGame(false);
  }

  return (
    <main className="hunch-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__backdrop" aria-hidden="true" />
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Hunch home"><span className="brand__mark">+</span><span>HUNCH</span></a>
          <div className="nav__meta"><span className="status-dot" /><span>THE TRUST GAME</span></div>
        </nav>
        <div className="hero__content" id="top">
          <p className="eyebrow"><span>01</span> Can you tell what&apos;s real?</p>
          <h1 id="hero-title">HUNCH<span>.</span></h1>
          <p className="tagline">Your instincts <i>vs.</i> the internet.</p>
          <p className="hero__description">A game that tests how well you can spot what deserves your trust.</p>
          <div className="hero__actions">{savedProgress && savedLevel && isCompleted ? <div className="continue-panel" aria-live="polite"><p className="continue-panel__greeting">🏆 HUNCH COMPLETE!</p><p>You completed all {levels.length} levels.</p><span>⭐ {savedProgress.totalXP} XP</span><span>🎯 {Math.round((savedProgress.correctAnswers / levels.reduce((count, level) => count + level.scenarioSet.length, 0)) * 100)}% ACCURACY</span><span>🔥 BEST STREAK: {savedProgress.bestStreak}</span><div className="continue-panel__actions"><Link className="button button--primary" href="/play">View results <span>→</span></Link><Link className="button button--ghost" href="/play?new=1">Play again</Link></div></div> : savedProgress && savedLevel ? <div className="continue-panel" aria-live="polite"><p className="continue-panel__greeting">WELCOME BACK 👋</p><p>You have an unfinished HUNCH game.</p><strong>LEVEL {savedLevel.number} — {savedLevel.name}</strong><span>ROUND {Math.min(savedProgress.currentRound + 1, savedLevel.scenarioSet.length)} / {savedLevel.scenarioSet.length}</span><span>⭐ {savedProgress.totalXP} XP</span><span>🔥 BEST STREAK: {savedProgress.bestStreak}</span><div className="continue-panel__actions"><Link className="button button--primary" href="/play">Continue <span>→</span></Link><button className="button button--ghost" type="button" onClick={() => setIsConfirmingNewGame(true)}>New game</button></div></div> : <><a className="button button--primary" href="/play">Play Hunch <span>↗</span></a><a className="button button--ghost" href="#how-it-works"><span className="play-icon">▶</span> How it works</a></>}</div>
        </div>
        <div className="hero__footer"><span className="scroll-cue"><span /> Scroll to investigate</span><span className="hero__coordinates">48°51&apos;N&nbsp;&nbsp; 2°21&apos;E</span></div>
      </section>

      <section className="preview-section" id="how-it-works" aria-labelledby="preview-title">
        <div className="section-intro"><p className="eyebrow"><span>02</span> Inside the game</p><h2 id="preview-title">The internet is<br /><em>lying</em> to you.</h2><p>Every round is a new signal to read. Trust your gut, then follow the clues.</p></div>
        <div className="scenario-window" id="play">
          <div className="window-bar"><span className="window-label"><span className="live-dot" /> LIVE SCENARIO</span><span className="window-count">ROUND 04 <b>/ 10</b></span></div>
          <div className="scenario-content"><div className="scenario-topline"><span>◈</span> SOCIAL ZONE <span className="scenario-time">02:14 AM</span></div><div className="message-card"><div className="message-profile"><span className="avatar">MJ</span><span><b>marcus.j</b><small>sent you a message</small></span><strong>•••</strong></div><p className="message-copy">hey! weird question — can you help me out? i&apos;m locked out of my account and need a code sent to your number.</p><div className="message-actions"><span>Reply</span><span>♡</span><span>↗</span></div></div><div className="choice-prompt">What&apos;s your hunch?</div><div className="choices"><button type="button" className="choice choice--maybe"><span>◐</span> Seems off</button><button type="button" className="choice choice--safe"><span>◉</span> Probably fine</button></div></div>
          <div className="window-footer"><span>MAKE YOUR CALL</span><span>+ 120 XP</span></div>
        </div>
      </section>
      {isConfirmingNewGame && <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="new-game-title"><div className="confirm-dialog__content"><p className="eyebrow">RESET YOUR PROGRESS</p><h2 id="new-game-title">Start a new game?</h2><p>Your current progress will be lost.</p><div className="hero__actions"><button className="button button--ghost" type="button" onClick={() => setIsConfirmingNewGame(false)}>Cancel</button><Link className="button button--primary" href="/play?new=1" onClick={handleNewGame}>Start new game</Link></div></div></div>}
      <footer className="site-footer"><span>HUNCH © 2026</span><span>TRUST NOTHING. VERIFY EVERYTHING.</span><span>MADE FOR THE CURIOUS <b>↗</b></span></footer>
    </main>
  );
}
