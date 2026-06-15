export const siteConfig = {
  title: "Journal",
  author: {
    name: "John Doe",
    affiliation: "Department of Computer Science, University",
    bio: "Researcher in quantum computing, machine learning, and mathematical optimization.",
    email: "john@example.com",
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} John Doe. All rights reserved.`,
  },
} as const;
