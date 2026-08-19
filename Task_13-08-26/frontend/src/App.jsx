import { useState } from 'react';
import Login from './components/Login';
import RestDemo from './components/RestDemo';
import GraphQLDemo from './components/GraphQLDemo';

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      <header>
        <h1>REST vs GraphQL — same data, two APIs</h1>
        <p className="subtitle">
          Both panels hit the same backend and render the same feed (posts + author + comment
          count). Load each one and watch the request count / timing above the list.
        </p>
        <Login onLogin={setUser} currentUser={user} />
      </header>

      <main className="grid">
        <RestDemo />
        <GraphQLDemo />
      </main>

      <footer>
        <p>
          Backend must be running on <code>localhost:4000</code> (<code>cd backend &amp;&amp; npm start</code>).
          See the repo README for the full write-up and <code>npm run perf</code> for a CLI comparison.
        </p>
      </footer>
    </div>
  );
}
