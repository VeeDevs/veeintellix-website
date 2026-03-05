import { useMemo, useState } from "react";

const questions = [
  "Security check: Do all privileged users in your business use MFA today?",
  "Product check: If your website goes down for 8 hours, what is the estimated sales impact?",
  "Automation check: Which repetitive workflow still wastes the most team time every week?",
  "Cyber check: Could your team detect and contain a breach in under 60 minutes?",
  "Reality check: Are your backups tested for full recovery, or only assumed to work?",
  "Growth check: Is your current site designed as a sales funnel or just a digital brochure?",
  "Reverse psychology: If your current setup is already perfect, why are conversions still underperforming?",
  "Leadership check: What is your 12-month AI strategy tied to measurable business outcomes?",
  "Industry revolution check: Are you building systems for the next 5 years or patching the last 5?",
  "Risk check: If customer data leaked tomorrow, are your response playbooks ready now?",
];

const bubbleLabels = [
  "Pop Me",
  "Challenge",
  "Security",
  "AI Readiness",
  "Growth",
  "Ops Test",
  "Risk IQ",
  "Modernise",
];

const BubbleChallenge = () => {
  const [poppedId, setPoppedId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);

  const bubbles = useMemo(
    () =>
      bubbleLabels.map((label, index) => ({
        id: index,
        label,
        left: `${6 + index * 11}%`,
        delay: `${(index % 5) * 0.8}s`,
        duration: `${7 + (index % 4)}s`,
      })),
    [],
  );

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  };

  const handlePop = (bubbleId: number) => {
    setPoppedId(bubbleId);
    setCurrentQuestion(getRandomQuestion());

    setTimeout(() => {
      setPoppedId(null);
    }, 380);
  };

  return (
    <section id="challenge" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-45 bg-[radial-gradient(circle_at_20%_20%,hsla(174,84%,44%,0.18),transparent_30%),radial-gradient(circle_at_82%_80%,hsla(196,92%,56%,0.16),transparent_28%)]" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold">
            Pop the floating buble to challenge yourself on veeintellix epxertise
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Click any floating bubble to pop it and trigger a randomized challenge about security, products, and your technology readiness.
          </p>
        </div>

        <div className="challenge-stage">
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              type="button"
              className={`challenge-bubble ${poppedId === bubble.id ? "is-popped" : ""}`}
              style={{
                left: bubble.left,
                animationDelay: bubble.delay,
                animationDuration: bubble.duration,
              }}
              onClick={() => handlePop(bubble.id)}
            >
              {bubble.label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/85 p-6 max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-primary/90 mb-2">Random Challenge</p>
          <p className="text-lg sm:text-xl font-medium leading-relaxed">{currentQuestion}</p>
          <button
            type="button"
            onClick={() => setCurrentQuestion(getRandomQuestion())}
            className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            Next Random Question
          </button>
        </div>
      </div>
    </section>
  );
};

export default BubbleChallenge;
