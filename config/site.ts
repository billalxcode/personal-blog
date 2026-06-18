export interface Project {
  readonly title: string;
  readonly image: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly links: {
    readonly github: string;
    readonly website?: string;
    readonly [key: string]: string | undefined;
  };
}

export interface SiteConfig {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly locale: string;
  readonly author: {
    readonly name: string;
    readonly affiliation: string;
    readonly bio: string;
    readonly email: string;
  };
  readonly keywords: readonly string[];
  readonly projects: readonly Project[];
  readonly footer: {
    readonly copyright: string;
  };
}

export const siteConfig: SiteConfig = {
  title: "Journal — Billal Fauzan",
  description:
    "Research articles and projects in Machine Learning, Agentic AI, and Computer Vision by Billal Fauzan.",
  url: "https://masbill.xyz",
  locale: "en_US",
  author: {
    name: "Billal Fauzan",
    affiliation: "Independent Researcher",
    bio: "Researcher in Machine Learning, Agentic AI, and Computer Vision.",
    email: "billal.xcode@gmail.com",
  },
  keywords: [
    "Machine Learning",
    "Agentic AI",
    "Computer Vision",
    "Research",
    "Billal Fauzan",
    "Science Blog",
    "LaTeX",
    "Quantum Computing",
  ],
  projects: [
    {
      title: "Agentic AI Framework",
      image: "/project-agent-ai.png",
      description: "An orchestration framework for building, testing, and deploying multi-agent AI systems with persistent state and dynamic tool selection.",
      tags: ["Agentic AI", "TypeScript", "LLMs", "Vector DB"],
      links: {
        github: "https://github.com/billalxcode/agentic-ai-framework",
        website: "https://masbill.xyz",
      },
    },
    {
      title: "Vision Model Classifier",
      image: "/project-vision-model.png",
      description: "Real-time object detection and classification model built using convolutional neural networks and optimized for edge devices.",
      tags: ["Computer Vision", "Python", "PyTorch", "CNN"],
      links: {
        github: "https://github.com/billalxcode/vision-model-classifier",
      },
    },
  ],
  footer: {
    copyright: `© ${new Date().getFullYear()} Billal Fauzan. All rights reserved.`,
  },
} as const;
