import { SearchResult } from '../types';
import { HighlightText } from './HighlightText';

interface Props {
  result: SearchResult;
  query: string;
  active: boolean;
  id: string;
  onSelect: () => void;
}

export function SearchResultItem({ result, query, active, id, onSelect }: Props) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      className={`search-option ${active ? 'active' : ''}`}
      onClick={onSelect}
    >
      <span className="search-option-name">
        <HighlightText text={result.name} query={query} />
      </span>
      <span className="search-option-category">{result.category}</span>
    </li>
  );
}
