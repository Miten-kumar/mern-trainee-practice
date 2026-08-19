// In-memory data store. In a real app this would live in Postgres/Mongo,
// but for the purpose of this challenge a seeded array keeps the backend
// dependency-free and easy to run.

let employees = [
  { id: 1, name: 'Ava Thompson', role: 'Frontend Engineer', department: 'Engineering', email: 'ava.thompson@example.com', location: 'Remote - UK', status: 'Active', bio: 'Focuses on accessible component architecture and design systems.' },
  { id: 2, name: 'Marcus Lee', role: 'Backend Engineer', department: 'Engineering', email: 'marcus.lee@example.com', location: 'Austin, TX', status: 'Active', bio: 'Builds and maintains the internal API platform.' },
  { id: 3, name: 'Priya Nair', role: 'Product Designer', department: 'Design', email: 'priya.nair@example.com', location: 'Bengaluru, IN', status: 'Active', bio: 'Leads inclusive design reviews across the product suite.' },
  { id: 4, name: 'Daniel Kim', role: 'QA Engineer', department: 'Engineering', email: 'daniel.kim@example.com', location: 'Seoul, KR', status: 'On Leave', bio: 'Owns the automated and manual accessibility testing pipeline.' },
  { id: 5, name: 'Sofia Rossi', role: 'Engineering Manager', department: 'Engineering', email: 'sofia.rossi@example.com', location: 'Milan, IT', status: 'Active', bio: 'Manages the platform team and cross-team accessibility standards.' },
  { id: 6, name: 'Wei Zhang', role: 'Data Analyst', department: 'Analytics', email: 'wei.zhang@example.com', location: 'Remote - CA', status: 'Active', bio: 'Tracks product usage and accessibility adoption metrics.' },
  { id: 7, name: 'Olivia Brown', role: 'Content Strategist', department: 'Marketing', email: 'olivia.brown@example.com', location: 'London, UK', status: 'Active', bio: 'Writes plain-language content and alt text guidelines.' },
  { id: 8, name: 'Noah Johnson', role: 'DevOps Engineer', department: 'Engineering', email: 'noah.johnson@example.com', location: 'Toronto, CA', status: 'Active', bio: 'Maintains CI/CD pipelines, including automated a11y checks.' },
  { id: 9, name: 'Emma Garcia', role: 'Customer Success Lead', department: 'Support', email: 'emma.garcia@example.com', location: 'Madrid, ES', status: 'Active', bio: 'Gathers accessibility feedback directly from users.' },
  { id: 10, name: 'Liam O\u2019Connor', role: 'Backend Engineer', department: 'Engineering', email: 'liam.oconnor@example.com', location: 'Dublin, IE', status: 'Inactive', bio: 'Previously owned the notifications service.' },
  { id: 11, name: 'Hana Kobayashi', role: 'UX Researcher', department: 'Design', email: 'hana.kobayashi@example.com', location: 'Tokyo, JP', status: 'Active', bio: 'Runs usability sessions with assistive technology users.' },
  { id: 12, name: 'Ethan Wright', role: 'Product Manager', department: 'Product', email: 'ethan.wright@example.com', location: 'New York, NY', status: 'Active', bio: 'Owns the roadmap for the directory and search experience.' }
];

module.exports = { employees };
