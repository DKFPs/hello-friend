import { timeline } from "../../data/site";

export function Timeline() {
  return (
    <div className="timeline">
      {timeline.map((item) => (
        <article className="timeline-item" key={item.year}>
          <div className="timeline-year">{item.year}</div>
          <div className="timeline-dot" aria-hidden="true" />
          <div className="timeline-card">
            <span className="eyebrow">{item.year}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
