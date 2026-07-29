export interface TextSegment {
  text: string;
  highlighted: boolean;
}

// splits `text` into segments around the first case-insensitive match
// of `query`, so the UI can bold just the matching part. Returns the
// whole text as one non-highlighted segment if there's no match.
export function highlightMatch(text: string, query: string): TextSegment[] {
  if (!query.trim()) {
    return [{ text, highlighted: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return [{ text, highlighted: false }];
  }

  const segments: TextSegment[] = [];

  if (matchIndex > 0) {
    segments.push({ text: text.slice(0, matchIndex), highlighted: false });
  }

  segments.push({ text: text.slice(matchIndex, matchIndex + query.length), highlighted: true });

  const afterIndex = matchIndex + query.length;
  if (afterIndex < text.length) {
    segments.push({ text: text.slice(afterIndex), highlighted: false });
  }

  return segments;
}
