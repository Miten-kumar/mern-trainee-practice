# Interview Questions - Job Application Form Project

Questions you could realistically get about this project, grouped by
topic. Short answer hints included so you can revise quickly, but
you should be able to explain each in your own words, not recite this.

---

## 1. General / Overview

- What does this project do, walk me through it?
  > A 5 step job application form (personal info, background, certifications,
  > documents, review). React + TypeScript frontend, Express backend that
  > stores submissions and uploaded files.
- Why did you build this?
- What was the hardest part?
- If you had another week, what would you add or change?
- Is this a full stack project or just frontend?
- What would you rename/restructure if you started over?

## 2. Tech stack & decisions

- Why React Hook Form instead of just useState for each field, or Formik?
  > RHF is uncontrolled by default (fewer re-renders), has a small API,
  > and has first class support for schema validation via resolvers.
- Why Zod instead of Yup or writing validation by hand?
  > TypeScript-first - schema and types stay in sync automatically via
  > `z.infer`. Also has good support for custom refinements.
- Why Vite instead of Create React App?
- Why plain CSS instead of Tailwind or a component library?
- Why Express and not Next.js/Fastify/NestJS for the backend?
- Why store data in a JSON file instead of a real database?
  > It's a learning project scoped to just the form; a DB would be a
  > drop-in replacement for the file read/write in the route handler.
- What would change if you had to add a real database?

## 3. React / Frontend architecture

- How is the project structured, and why?
- Why is each step its own component?
- What state lives in App.tsx vs in each step component?
- Walk me through what happens when the user clicks "Next".
- How do you know which step you're currently on?
- Why did you use one big form (single `useForm`) instead of a separate
  form per step?
  > Keeps all values and validation in one schema, easier to review
  > everything on the last step, and avoids re-collecting state when
  > going back and forth between steps.
- What's the difference between controlled and uncontrolled inputs, and
  which does RHF use by default?
- What does `register()` actually do?
- What's `trigger()` used for here, and why only validate specific
  fields per step instead of the whole form on every "Next" click?

## 4. Validation / Zod

- How does the conditional validation work (employed vs student)?
  > `superRefine` runs after the base schema, checks `employmentStatus`,
  > and adds custom issues on `companyName`/`jobTitle` or
  > `schoolName`/`graduationYear` if missing.
- Why use `superRefine` instead of `z.discriminatedUnion`?
  > Discriminated union is possible, but this schema shares most fields
  > across the branches, so superRefine avoids duplicating the schema.
- How would you add a 4th employment status (e.g. "self-employed") with
  its own required fields?
- How are file uploads validated with Zod, since files aren't just
  strings/numbers?
- What happens if the user picks a 6MB resume?
- What's `zodResolver` doing?
- What's the difference between client-side and server-side validation
  here, and why do you need both?
  > Client validation is for UX (instant feedback); server validation
  > is the actual security boundary since a client can be bypassed.

## 5. Dynamic & conditional fields

- How do you add/remove certification entries dynamically?
  > `useFieldArray` from React Hook Form, gives `fields`, `append`, `remove`.
- Why does each field array item use `field.id` as the React key instead
  of the array index?
  > `field.id` is a stable id RHF generates per row, so React doesn't
  > mix up rows when one is removed from the middle of the list.
- What would break if you used the array index as the key instead?
- How would you let the user reorder certifications instead of just
  add/remove?

## 6. File uploads

- Walk me through what happens from "user selects a file" to "file is
  saved on the server."
- Why use `multer` on the backend?
- How do you prevent someone from uploading a 500MB file or an .exe?
  > `multer`'s `limits.fileSize` and a `fileFilter` checking mimetype,
  > plus the same checks client side with Zod (for UX, not security).
- Why validate file type/size on both client and server?
- What does `multer.diskStorage` do, and where do uploaded files end up?
- How are filenames generated, and why not just use the original name?
  > Avoids collisions/overwrites and path traversal issues from
  > user-controlled filenames.
- How would you send these files to S3 or another cloud store instead
  of local disk?
- Why is the form submitted with `FormData` instead of JSON?
  > Files can't be serialized into JSON; `multipart/form-data` is the
  > standard way to send files + text fields together.

## 7. Progress persistence (localStorage)

- How does the form remember progress if the user refreshes the page?
- Why can't file inputs be restored after a refresh?
  > `File` objects aren't serializable to JSON/localStorage for
  > security reasons (browsers won't let you fabricate a `File` handle);
  > the user has to re-select the file.
- What happens if localStorage is full or disabled (e.g. private mode)?
- What's the debounce in the save effect for, and what would happen
  without it?
- Where else could progress be saved instead of localStorage (cookies,
  server-side draft, IndexedDB), and what are the tradeoffs?
- How would you clear stale/old saved progress after, say, 24 hours?

## 8. Backend / API design

- What does the `POST /api/applications` route do step by step?
- Why is validation duplicated on the backend if the frontend already
  validates?
- What status codes does the API return, and when?
- How would you add authentication so only logged-in users can submit?
- How would you rate-limit this endpoint to stop spam submissions?
- Why is `app.js` separate from `server.js`?
  > So the Express app can be imported and tested (with supertest)
  > without actually binding to a port.
- What happens if two people submit at the exact same time - is there
  a race condition writing to the JSON file?
  > Yes, potentially - reading then writing the whole file isn't atomic.
  > A real database would handle concurrent writes properly.

## 9. Error handling

- What happens if the backend is down when the user submits?
- What happens if the server returns a 500?
- Where do validation errors show up in the UI?
- How does accessibility tie into error handling (announcing errors to
  screen reader users)?
- What's the difference between the inline field errors and the
  submit error banner?

## 10. Accessibility

- What specific things did you do for accessibility in this form?
  > Labels linked to inputs via `htmlFor`/`id`, `aria-invalid` and
  > `aria-describedby` on invalid fields, `role="alert"` on error text,
  > a `fieldset`/`legend` for the radio group, an `aria-live` region
  > announcing the current step, and focus moving to the step heading
  > on step change.
- How would you test this with a screen reader?
- Why use a `fieldset`/`legend` for the employment status radios instead
  of just three separate labeled inputs?
- What is `aria-live` doing, and what's the difference between "polite"
  and "assertive"?
- How do you make sure keyboard-only users can complete the whole form?
- What's `:focus-visible` doing in the CSS?

## 11. Testing

- What's tested in this project?
  > Backend: the API route (missing fields, missing resume, bad file
  > type, successful submission, that it's actually saved). Frontend:
  > the Zod schema logic (conditional validation, file checks).
- Why test the Zod schema directly instead of testing the whole form
  through the UI?
  > Schema tests are fast and cover the validation logic in isolation;
  > UI tests would additionally need React Testing Library and are
  > better suited for testing user flows, not every validation rule.
- What's NOT tested here, and how would you cover it?
  > No end-to-end test (e.g. Playwright/Cypress) that walks through all
  > 5 steps in a real browser, no component-level tests for the step
  > components themselves.
- What's the difference between unit, integration, and e2e tests, and
  where does each test in this project fall?
- How do you avoid tests polluting real data (the JSON file / uploads
  folder) when they run?
- How would you mock the file system in the backend tests instead of
  writing to real files?

## 12. Security

- What stops someone from submitting the form without a resume by
  calling the API directly (bypassing the frontend)?
- What stops path traversal or overwriting another user's file?
- Is there anything sensitive being stored here that needs extra care?
- How would you add CSRF protection or rate limiting?
- What would you change before this went to production?
  > Add a real database, auth, rate limiting, HTTPS, environment based
  > config instead of a hardcoded API URL, and probably file storage
  > in cloud storage instead of local disk.

## 13. Performance / scalability

- Would this scale to thousands of submissions a day as-is? Why or why
  not?
- What's the bottleneck in the current backend design?
  > Reading/rewriting the whole JSON file on every submission.
- How would you paginate or query submissions later (e.g. an admin
  view)?
- Any unnecessary re-renders in the form, and how would you check?

## 14. Behavioral / process

- What would you do differently if you rebuilt this?
- How did you decide on 5 steps instead of a single long form?
- How did you pick which fields needed conditional validation?
- Did you consider any other libraries or approaches before settling
  on this stack?
- How do you know the form is "done" - what's your definition of done
  for a project like this?
