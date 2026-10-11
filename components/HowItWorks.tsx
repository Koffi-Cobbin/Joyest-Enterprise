import Reveal from "@/components/Reveal";

const STEPS = [
  {
    number: "1",
    title: "Browse",
    body: "Explore our nutritional foods, natural hair care, aromatic spices and more — everything is made or sourced with care.",
  },
  {
    number: "2",
    title: "Order on WhatsApp",
    body: "Add your picks to the cart, then send us your order in one tap — no accounts, no checkout forms.",
  },
  {
    number: "3",
    title: "We confirm & deliver",
    body: "We reply to confirm availability, delivery and payment straight in the chat. Quote your order ref anytime.",
  },
] as const;

/** 3-step "how ordering works" band (borrowed from Joyest's ritual list) */
export default function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="bg-secondary text-background">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <p className="text-center font-ui text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Simple ordering
          </p>
          <h2
            id="how-heading"
            className="mt-2 text-center font-serif text-3xl font-semibold"
          >
            How ordering works
          </h2>
        </Reveal>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.number} delay={index * 100}>
              <li className="text-center">
                <span
                  aria-hidden="true"
                  className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent font-serif text-xl font-bold text-foreground"
                >
                  {step.number}
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-background/80">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
