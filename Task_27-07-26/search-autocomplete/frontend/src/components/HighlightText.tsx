import { highlightMatch } from '../utils/highlightMatch';

interface Props {
  text: string;
  query: string;
}

export function HighlightText({ text, query }: Props) {
  const segments = highlightMatch(text, query);

  return (
    <>
      {segments.map((segment, i) =>
        segment.highlighted ? <mark key={i}>{segment.text}</mark> : <span key={i}>{segment.text}</span>
      )}
    </>
  );
}
