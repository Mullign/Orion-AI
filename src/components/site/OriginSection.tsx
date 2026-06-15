export function OriginSection() {
  return (
    <section id="story" className="border-t border-border px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-3 text-sm text-muted">How it actually started</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Uncompromised local LLM experience.
        </h2>

        <div className="mt-8 space-y-6 text-base leading-8 text-muted">
          <p>
            Orion was built because running local AI should feel simple and
            trustworthy. Cloud chat tools are convenient, but they ask you to
            send private context to someone else&apos;s servers — and they often
            need API keys, subscriptions, and constant connectivity.
          </p>
          <p>
            Ollama already made local models possible. Orion wraps that in a
            focused experience: local inference, model flexibility, and a setup
            you control from your own machine.
          </p>
          <p>
            The more your setup stays on your machine, the more useful it becomes
            without compromising privacy. That&apos;s the point — local inference,
            your models, your rules.
          </p>
        </div>
      </div>
    </section>
  );
}
