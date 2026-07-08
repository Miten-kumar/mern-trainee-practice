# Flexible Tab Component System

Compound component tab system: `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`.
Built with Context API + TypeScript, supports keyboard navigation, lazy panel
loading, and both controlled and uncontrolled modes.

## Structure

```
frontend/
  src/
    components/
      Tabs/
        Tabs.tsx        - root component, owns active index state
        TabsContext.ts   - the context + hook to read it
        TabList.tsx      - renders tabs, handles keyboard nav
        Tab.tsx          - single tab button
        TabPanels.tsx    - wraps panels, injects index
        TabPanel.tsx     - single panel, lazy mounts its content
        types.ts         - shared prop types
        index.ts         - barrel export
      LazyProof.tsx      - demo helper, proves lazy loading visually
    App.tsx              - usage examples (controlled + uncontrolled)
```

No backend here — this challenge is a pure UI component, there's no data
to serve.

## Running it

```
cd frontend
npm install
npm run dev
```

## How each requirement was met

**Compound components + Context API**
`Tabs` creates a context (`activeIndex`, `setActiveIndex`, `visited`) and
provides it to everything nested inside it. `TabList`/`TabPanels` inject
an `index` prop into each `Tab`/`TabPanel` child automatically using
`Children.map` + `cloneElement`, so you never have to manually number your
tabs:

```tsx
<Tabs defaultIndex={0}>
  <TabList>
    <Tab>Profile</Tab>
    <Tab>Settings</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>...</TabPanel>
    <TabPanel>...</TabPanel>
  </TabPanels>
</Tabs>
```

**Keyboard navigation**
`TabList` listens for `keydown` on itself: `ArrowRight`/`ArrowLeft` move
between tabs (wrapping around at the ends), `Home`/`End` jump to the
first/last tab. It uses a roving tabindex (only the active tab has
`tabIndex={0}`, the rest are `-1`), which is the standard accessible
pattern for tabs — Tab key moves focus into and out of the tab list as one
stop, arrow keys move between tabs within it.

**Lazy loading**
`Tabs` keeps a `visited: Set<number>` of every tab index that's ever been
active. `TabPanel` checks `visited.has(index)` and renders `null` until
its tab has been opened at least once — so panel content (and any data
fetching inside it) doesn't run until the user actually looks at that tab.
Once visited, a panel stays mounted (state inside it survives switching
away and back) unless you pass `keepMounted={false}`, which unmounts it
every time it's not active.

**Controlled / uncontrolled**
```tsx
// uncontrolled - Tabs manages its own state internally
<Tabs defaultIndex={0}>...</Tabs>

// controlled - parent owns the state
const [active, setActive] = useState(0);
<Tabs index={active} onChange={setActive}>...</Tabs>
```
`Tabs` checks whether `index` was passed; if so it stops updating its own
internal state and just calls `onChange`, leaving the parent in charge.

## Manually verifying it

- Click a tab, click another — content loads instantly since it's already
  been visited, but the *first* time you open a tab you can see it mount
  (the "Lazy Proof" text shows a mount timestamp that never changes after
  that, proving it's not remounting on every tab switch)
- Click into the tab list, then use ArrowRight/ArrowLeft/Home/End — focus
  and selection move together, Tab key moves you out of the whole widget
- In the controlled example, click "Jump to Overview"/"Jump to Reports" —
  those buttons live outside the `Tabs` component entirely and still
  control which tab is active, proving the controlled mode works
- Open React DevTools on the controlled example's second tab
  (`keepMounted={false}`) — switch away and its DOM node disappears
  completely, unlike the other panels which just get `hidden`
