# HUNCH — AI Coding Instructions

## Product

HUNCH is a playful interactive web game that trains users to make better trust decisions in an AI-generated internet.

Tagline:
"Your instincts vs. the internet."

The player encounters realistic digital situations involving scams, impersonation, social engineering, AI-generated content, deepfakes, fake job offers, shopping scams, and other online trust situations.

The core gameplay loop is:

Situation → Hunch → Action → Reveal → Trust Lesson → XP → Next Round

HUNCH is a game, not a cybersecurity dashboard, educational portal, or corporate SaaS application.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Compiler
- GitHub
- Vercel
- Supabase will be added later
- PostHog analytics will be added later
- Google Forms will be used for feedback

Do not introduce additional frameworks or services unless explicitly requested.

## Visual Direction

HUNCH should feel like:

- playful cyber-thriller
- digital detective game
- polished modern game UI
- slightly mysterious but fun
- expressive and interactive

Avoid:

- generic corporate SaaS designs
- boring cybersecurity dashboards
- excessive hacker clichés
- excessive neon green "hacker" styling
- generic stock illustrations
- cluttered interfaces

Preferred visual language:

- deep navy / dark backgrounds
- purple, blue and teal accents
- green for safe/correct states
- yellow for suspicious states
- red for danger/wrong states
- glass-like cards
- subtle glow effects
- rounded UI elements
- strong typography
- smooth transitions and micro-interactions

## Assets

Custom backgrounds are stored in:

/public/backgrounds/

Available backgrounds include:

- digital-city.jpg
- social-zone.jpg
- work-district.jpg
- shopping-district.jpg
- ai-lab.jpg

Always use these assets where appropriate instead of creating generic placeholder backgrounds.

Character assets will be added later under:

/public/characters/

UI assets will be added later under:

/public/ui/

## UX Principles

The experience should feel like a game.

Prioritize:

1. Immediate understanding
2. Fun interaction
3. Visual feedback
4. Short decision cycles
5. Clear progression
6. Meaningful rewards
7. Mobile responsiveness

Do not overwhelm the player with paragraphs of text.

Keep scenario content concise and readable.

## Core Gameplay

Each scenario should eventually contain:

- scenario text
- category
- difficulty
- hunch options
- action options
- correct action
- red flags
- explanation
- trust lesson
- XP reward

Not every scenario should be a scam.

Include:

- suspicious scenarios
- legitimate scenarios
- ambiguous scenarios

The game should teach verification and judgment rather than simply teaching users to distrust everything.

## Development Rules

Build incrementally.

Do not implement the entire product at once.

When asked to build a feature:

1. Inspect the existing code.
2. Reuse existing components where possible.
3. Keep components modular.
4. Avoid unnecessary dependencies.
5. Do not rewrite unrelated parts of the application.
6. Test the feature before moving on.
7. Explain important changes after implementation.

Do not add authentication, databases, analytics, AI APIs, leaderboards, or other major systems unless explicitly requested.

The MVP must remain functional without paid APIs.

## Code Quality

Use TypeScript properly.

Avoid unnecessary `any`.

Keep components readable and reasonably small.

Use semantic HTML and accessible interactive elements.

Make all layouts responsive.

Do not hardcode repeated UI structures when a reusable component is appropriate.

## Important

HUNCH should feel like something people want to play, not something they are forced to learn.

When making design decisions, prioritize:

FUN → CLARITY → POLISH → COMPLEXITY

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
