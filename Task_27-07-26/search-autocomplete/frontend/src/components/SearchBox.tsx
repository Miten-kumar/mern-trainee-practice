import { useEffect, useRef, useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import { SearchResultItem } from './SearchResultItem';
import { SearchResult } from '../types';

interface Props {
  onSelect?: (result: SearchResult) => void;
}

export function SearchBox({ onSelect }: Props) {
  const { query, setQuery, results, loading, error, hasSearched } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // whenever a new set of results comes in, the old activeIndex might
  // not make sense anymore (could point past the end, or at a
  // completely different item), so reset it
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  function selectResult(result: SearchResult) {
    setQuery(result.name);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(result);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (results.length === 0 ? -1 : (i + 1) % results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (results.length === 0 ? -1 : (i - 1 + results.length) % results.length));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        selectResult(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = isOpen && query.trim().length > 0;
  const activeId = activeIndex >= 0 ? `search-option-${activeIndex}` : undefined;

  return (
    <div className="search-box">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="search-listbox"
        aria-activedescendant={activeId}
        aria-autocomplete="list"
        placeholder="Search languages, frameworks, tools..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => query.trim() && setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
      />
      {loading && <span className="search-spinner" aria-hidden="true" />}

      {showDropdown && (
        // preventDefault on mousedown stops the input from blurring
        // before the click on an option registers - without this,
        // onBlur would close the dropdown before onClick ever fires
        <div className="search-dropdown" onMouseDown={(e) => e.preventDefault()}>
          {query.trim().length > 0 && results.length === 0 && !loading && hasSearched && !error && (
            <p className="search-empty">No results found for "{query}"</p>
          )}

          {error && <p className="search-error">{error}</p>}

          {results.length > 0 && (
            <ul className="search-listbox" id="search-listbox" role="listbox">
              {results.map((result, index) => (
                <SearchResultItem
                  key={result.id}
                  id={`search-option-${index}`}
                  result={result}
                  query={query}
                  active={index === activeIndex}
                  onSelect={() => selectResult(result)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
