import type { BookNode } from "@/book/bookNode"

export const sampleBooks: BookNode[] = [
  // Level 1 - Foundational Books
  {
    id: "clean-code",
    isbn13: 9780132350884,
    isbn10: 132350882,
    title: "Clean Code",
    subtitle: "A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    categories: "Programming, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.",
    published_year: 2008,
    average_rating: 4.6,
    num_pages: 464,
    embedding: [],
    prerequisites: [],
  },
  {
    id: "pragmatic-programmer",
    isbn13: 9780201616224,
    isbn10: 201616224,
    title: "The Pragmatic Programmer",
    subtitle: "From Journeyman to Master",
    author: "Andrew Hunt, David Thomas",
    categories: "Programming, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users.",
    published_year: 1999,
    average_rating: 4.7,
    num_pages: 352,
    embedding: [],
    prerequisites: [],
  },
  {
    id: "code-complete",
    isbn13: 9780735619678,
    isbn10: 735619670,
    title: "Code Complete",
    subtitle: "A Practical Handbook of Software Construction",
    author: "Steve McConnell",
    categories: "Programming, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Widely considered one of the best practical guides to programming, Steve McConnell's original CODE COMPLETE has been helping developers write better software for more than a decade.",
    published_year: 2004,
    average_rating: 4.6,
    num_pages: 960,
    embedding: [],
    prerequisites: [],
  },

  // Level 2 - Building on Fundamentals
  {
    id: "clean-architecture",
    isbn13: 9780134494166,
    isbn10: 134494164,
    title: "Clean Architecture",
    subtitle: "A Craftsman's Guide to Software Structure and Design",
    author: "Robert C. Martin",
    categories: "Programming, Software Architecture",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "By applying universal rules of software architecture, you can dramatically improve developer productivity throughout the life of any software system.",
    published_year: 2017,
    average_rating: 4.4,
    num_pages: 432,
    embedding: [],
    prerequisites: [9780132350884], // Clean Code
  },
  {
    id: "refactoring",
    isbn13: 9780201485677,
    isbn10: 201485672,
    title: "Refactoring",
    subtitle: "Improving the Design of Existing Code",
    author: "Martin Fowler",
    categories: "Programming, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Refactoring is about improving the design of existing code. It is the process of changing a software system in such a way that it does not alter the external behavior of the code, yet improves its internal structure.",
    published_year: 1999,
    average_rating: 4.5,
    num_pages: 464,
    embedding: [],
    prerequisites: [9780132350884], // Clean Code
  },
  {
    id: "design-patterns",
    isbn13: 9780201633610,
    isbn10: 201633612,
    title: "Design Patterns",
    subtitle: "Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    categories: "Programming, Software Design",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
    published_year: 1994,
    average_rating: 4.5,
    num_pages: 416,
    embedding: [],
    prerequisites: [9780201616224], // The Pragmatic Programmer
  },
  {
    id: "tdd",
    isbn13: 9780321146533,
    isbn10: 321146530,
    title: "Test Driven Development",
    subtitle: "By Example",
    author: "Kent Beck",
    categories: "Programming, Software Testing",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Follows two TDD projects from start to finish, illustrating techniques programmers can use to increase the quality of their work.",
    published_year: 2002,
    average_rating: 4.2,
    num_pages: 240,
    embedding: [],
    prerequisites: [9780735619678], // Code Complete
  },

  // Level 3 - Intermediate Topics
  {
    id: "domain-driven-design",
    isbn13: 9780321125217,
    isbn10: 321125215,
    title: "Domain-Driven Design",
    subtitle: "Tackling Complexity in the Heart of Software",
    author: "Eric Evans",
    categories: "Programming, Software Architecture",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "This is not a book about specific technologies. It offers readers a systematic approach to domain-driven design, presenting an extensive set of design best practices.",
    published_year: 2003,
    average_rating: 4.4,
    num_pages: 560,
    embedding: [],
    prerequisites: [9780134494166], // Clean Architecture
  },
  {
    id: "continuous-delivery",
    isbn13: 9780321601919,
    isbn10: 321601912,
    title: "Continuous Delivery",
    subtitle: "Reliable Software Releases through Build, Test, and Deployment Automation",
    author: "Jez Humble, David Farley",
    categories: "DevOps, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Getting software released to users is often a painful, risky, and time-consuming process. This book sets out the principles and technical practices that enable rapid, incremental delivery of high quality, valuable new functionality to users.",
    published_year: 2010,
    average_rating: 4.5,
    num_pages: 512,
    embedding: [],
    prerequisites: [9780201485677, 9780321146533], // Refactoring, Test Driven Development
  },
  {
    id: "patterns-enterprise-app",
    isbn13: 9780321127426,
    isbn10: 321127420,
    title: "Patterns of Enterprise Application Architecture",
    subtitle: "",
    author: "Martin Fowler",
    categories: "Programming, Software Architecture",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "This book is written for the professional programmer. The author assumes you know your stuff. Unlike many books that emphasize theory over implementation, this book takes a practical approach.",
    published_year: 2002,
    average_rating: 4.3,
    num_pages: 560,
    embedding: [],
    prerequisites: [9780201633610], // Design Patterns
  },

  // Level 4 - Advanced Topics
  {
    id: "implementing-ddd",
    isbn13: 9780321834577,
    isbn10: 321834577,
    title: "Implementing Domain-Driven Design",
    subtitle: "",
    author: "Vaughn Vernon",
    categories: "Programming, Software Architecture",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Implementing Domain-Driven Design presents a top-down approach to understanding domain-driven design in a way that fluently connects strategic patterns to fundamental tactical programming tools.",
    published_year: 2013,
    average_rating: 4.4,
    num_pages: 656,
    embedding: [],
    prerequisites: [9780321125217], // Domain-Driven Design
  },
  {
    id: "microservices-patterns",
    isbn13: 9781617294549,
    isbn10: 1617294543,
    title: "Microservices Patterns",
    subtitle: "With examples in Java",
    author: "Chris Richardson",
    categories: "Microservices, Software Architecture",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Microservices Patterns teaches you how to develop and deploy production-quality microservices-based applications.",
    published_year: 2018,
    average_rating: 4.5,
    num_pages: 520,
    embedding: [],
    prerequisites: [9780321127426, 9780321601919], // Patterns of Enterprise Application Architecture, Continuous Delivery
  },
  {
    id: "release-it",
    isbn13: 9781680502398,
    isbn10: 1680502395,
    title: "Release It!",
    subtitle: "Design and Deploy Production-Ready Software",
    author: "Michael T. Nygard",
    categories: "DevOps, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "A single dramatic software failure can cost a company millions of dollars - but can be avoided with simple changes to design and architecture.",
    published_year: 2018,
    average_rating: 4.6,
    num_pages: 376,
    embedding: [],
    prerequisites: [9780321601919], // Continuous Delivery
  },

  // Level 5 - Specialized Topics
  {
    id: "building-microservices",
    isbn13: 9781491950357,
    isbn10: 1491950358,
    title: "Building Microservices",
    subtitle: "Designing Fine-Grained Systems",
    author: "Sam Newman",
    categories: "Microservices, Software Architecture",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Distributed systems have become more fine-grained as organizations shift from code-heavy monolithic applications to smaller, self-contained microservices.",
    published_year: 2015,
    average_rating: 4.3,
    num_pages: 280,
    embedding: [],
    prerequisites: [9781617294549], // Microservices Patterns
  },
  {
    id: "devops-handbook",
    isbn13: 9781942788003,
    isbn10: 1942788002,
    title: "The DevOps Handbook",
    subtitle: "How to Create World-Class Agility, Reliability, & Security in Technology Organizations",
    author: "Gene Kim, Jez Humble, Patrick Debois, John Willis",
    categories: "DevOps, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "The DevOps Handbook shows leaders how to replicate these incredible outcomes, by showing how to integrate Product Management, Development, QA, IT Operations, and Information Security to elevate your company.",
    published_year: 2016,
    average_rating: 4.6,
    num_pages: 480,
    embedding: [],
    prerequisites: [9781680502398], // Release It!
  },
  {
    id: "data-intensive-apps",
    isbn13: 9781449373320,
    isbn10: 1449373321,
    title: "Designing Data-Intensive Applications",
    subtitle: "The Big Ideas Behind Reliable, Scalable, and Maintainable Systems",
    author: "Martin Kleppmann",
    categories: "Distributed Systems, Software Architecture",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.",
    published_year: 2017,
    average_rating: 4.8,
    num_pages: 616,
    embedding: [],
    prerequisites: [9780321834577, 9781680502398], // Implementing Domain-Driven Design, Release It!
  },

  // Level 6 - Expert Topics
  {
    id: "site-reliability-engineering",
    isbn13: 9781491929124,
    isbn10: 149192912,
    title: "Site Reliability Engineering",
    subtitle: "How Google Runs Production Systems",
    author: "Niall Richard Murphy, Betsy Beyer, Chris Jones, Jennifer Petoff",
    categories: "DevOps, System Administration",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Members of Google's Site Reliability Team explain how their engagement with the entire software lifecycle has enabled Google to build, deploy, monitor, and maintain some of the largest software systems in the world.",
    published_year: 2016,
    average_rating: 4.4,
    num_pages: 552,
    embedding: [],
    prerequisites: [9781942788003, 9781491950357], // DevOps Handbook, Building Microservices
  },
  {
    id: "accelerate",
    isbn13: 9781942788331,
    isbn10: 1942788339,
    title: "Accelerate",
    subtitle: "The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations",
    author: "Nicole Forsgren, Jez Humble, Gene Kim",
    categories: "DevOps, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "How can we apply technology to drive business value? For years, we've been told that the performance of software delivery teams doesn't matter―that it can't provide a competitive advantage to our companies. Through four years of groundbreaking research, Dr. Nicole Forsgren, Jez Humble, and Gene Kim set out to find a way to measure software delivery performance.",
    published_year: 2018,
    average_rating: 4.5,
    num_pages: 288,
    embedding: [],
    prerequisites: [9781942788003], // DevOps Handbook
  },
  {
    id: "database-internals",
    isbn13: 9781492040347,
    isbn10: 1492040347,
    title: "Database Internals",
    subtitle: "A Deep Dive into How Distributed Data Systems Work",
    author: "Alex Petrov",
    categories: "Databases, Distributed Systems",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "When it comes to choosing, using, and maintaining a database, understanding its internals is essential. But with so many distributed databases and tools available today, it's often difficult to understand what each one offers and how they differ.",
    published_year: 2019,
    average_rating: 4.6,
    num_pages: 376,
    embedding: [],
    prerequisites: [9781449373320], // Designing Data-Intensive Applications
  },

  // Level 7 - Mastery
  {
    id: "system-design-interview",
    isbn13: 9798664653403,
    isbn10: 8664653403,
    title: "System Design Interview",
    subtitle: "An Insider's Guide",
    author: "Alex Xu",
    categories: "System Design, Software Architecture",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "The system design interview is considered to be the most complex and most difficult technical job interview by many. This book provides a step-by-step framework on how to tackle a system design question.",
    published_year: 2020,
    average_rating: 4.6,
    num_pages: 322,
    embedding: [],
    prerequisites: [9781491929124, 9781492040347, 9781942788331], // Site Reliability Engineering, Database Internals, Accelerate
  },
  {
    id: "staff-engineer",
    isbn13: 9781736417911,
    isbn10: 1736417916,
    title: "Staff Engineer",
    subtitle: "Leadership beyond the management track",
    author: "Will Larson",
    categories: "Career, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "At most technology companies, you'll reach Senior Software Engineer, the career level for software engineers, in five to eight years. At that career level, you'll no longer be evaluated primarily on your technical contributions, but on your ability to advance strategic company initiatives.",
    published_year: 2021,
    average_rating: 4.5,
    num_pages: 284,
    embedding: [],
    prerequisites: [9781942788331], // Accelerate
  },
]