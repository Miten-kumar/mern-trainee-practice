import { useState } from 'react';
import { SearchBox } from './components/SearchBox';
import { SearchResult } from './types';

export default function App() {
  const [selected, setSelected] = useState<SearchResult | null>(null);

  return (
    <div className="app-shell">
      <h1>Search</h1>
      <SearchBox onSelect={setSelected} />

      {selected && (
        <div className="selected-panel">
          <p>
            You picked <strong>{selected.name}</strong> ({selected.category})
          </p>
        </div>
      )}
    </div>
  );
}
