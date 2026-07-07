export interface Tab {
  id: number;
  label: string;
  content: string;
}

const tabs: Tab[] = [
  {
    id: 1,
    label: "Home",
    content:
      "Welcome to the Home page. This is the default tab content.",
  },
  {
    id: 2,
    label: "Products",
    content:
      "Browse our latest products and explore the available collection.",
  },
  {
    id: 3,
    label: "Services",
    content:
      "We provide web development, mobile applications, and cloud solutions.",
  },
  {
    id: 4,
    label: "About",
    content:
      "This project demonstrates a Compound Component Tab System using Context API and TypeScript.",
  },
  {
    id: 5,
    label: "Contact",
    content:
      "Contact us at support@example.com or call +91-9876543210.",
  },
];

export default tabs;