type FAQAccordionProps = {
  items: Array<{
    id: string;
    question: string;
    answer: string;
    category?: string;
  }>;
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <details key={item.id} className="card-surface group p-6">
          <summary className="cursor-pointer list-none font-[family-name:var(--font-heading)] text-lg font-bold text-ink">
            {item.question}
          </summary>
          <div className="mt-4 text-sm leading-7 text-muted">
            {item.category ? (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
                {item.category}
              </p>
            ) : null}
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

