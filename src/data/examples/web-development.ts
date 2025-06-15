import type { BookNode } from "@/book/bookNode"

export const webDevelopmentExample = {
  query: "Web Development",
  finalResponse: `We found some excellent books for learning Web Development organized by learning levels:

**Level 1 - Foundations:** HTML, CSS, and JavaScript fundamentals
**Level 2 - Core Skills:** Modern JavaScript, responsive design, and version control
**Level 3 - Frontend Frameworks:** React, Vue, and modern frontend development
**Level 4 - Backend Development:** Node.js, databases, and server-side programming
**Level 5 - Full-Stack Skills:** APIs, authentication, and complete web applications
**Level 6 - Advanced Topics:** Performance optimization, security, and deployment
**Level 7 - Professional Development:** Architecture, testing, and best practices

Follow this progressive learning path to master Web Development from beginner to professional level!`,

  books: [
    // Level 1 - Foundational Books
    {
      id: "html-css-design",
      isbn13: 9781118008188,
      isbn10: 1118008189,
      title: "HTML and CSS: Design and Build Websites",
      subtitle: "",
      author: "Jon Duckett",
      categories: "HTML, CSS, Web Design",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "A full-color introduction to the basics of HTML and CSS from the publishers of Wrox. Every lesson in this book is displayed across two pages—an approach that's perfect for beginners.",
      published_year: 2011,
      average_rating: 4.5,
      num_pages: 490,
      embedding: [],
      prerequisites: [],
    },
    {
      id: "javascript-definitive-guide",
      isbn13: 9781491952023,
      isbn10: 1491952024,
      title: "JavaScript: The Definitive Guide",
      subtitle: "Master the World's Most-Used Programming Language",
      author: "David Flanagan",
      categories: "JavaScript, Programming",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "JavaScript is the programming language of the web and is used by more software developers today than any other programming language. For nearly 25 years this best seller has been the go-to guide.",
      published_year: 2020,
      average_rating: 4.3,
      num_pages: 687,
      embedding: [],
      prerequisites: [],
    },
    {
      id: "learning-web-design",
      isbn13: 9781491960202,
      isbn10: 1491960205,
      title: "Learning Web Design",
      subtitle: "A Beginner's Guide to HTML, CSS, JavaScript, and Web Graphics",
      author: "Jennifer Niederst Robbins",
      categories: "Web Design, HTML, CSS",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Do you want to build web pages but have no prior experience? This friendly guide is the perfect place to start. You'll begin at square one, learning how the web and web pages work.",
      published_year: 2018,
      average_rating: 4.4,
      num_pages: 808,
      embedding: [],
      prerequisites: [],
    },

    // Level 2 - Core Skills
    {
      id: "eloquent-javascript",
      isbn13: 9781593279509,
      isbn10: 1593279507,
      title: "Eloquent JavaScript",
      subtitle: "A Modern Introduction to Programming",
      author: "Marijn Haverbeke",
      categories: "JavaScript, Programming",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon.",
      published_year: 2018,
      average_rating: 4.2,
      num_pages: 472,
      embedding: [],
      prerequisites: [9781491952023], // JavaScript: The Definitive Guide
    },
    {
      id: "css-secrets",
      isbn13: 9781449372637,
      isbn10: 1449372635,
      title: "CSS Secrets",
      subtitle: "Better Solutions to Everyday Web Design Problems",
      author: "Lea Verou",
      categories: "CSS, Web Design",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "In this practical guide, CSS expert Lea Verou provides 47 undocumented techniques and tips to help intermediate to advanced CSS developers devise elegant solutions to a wide range of everyday web design problems.",
      published_year: 2015,
      average_rating: 4.6,
      num_pages: 372,
      embedding: [],
      prerequisites: [9781118008188], // HTML and CSS: Design and Build Websites
    },
    {
      id: "pro-git",
      isbn13: 9781484200773,
      isbn10: 1484200772,
      title: "Pro Git",
      subtitle: "Everything You Need to Know About Git",
      author: "Scott Chacon, Ben Straub",
      categories: "Git, Version Control",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Pro Git is your fully-updated guide to Git and its usage in the modern world. Git has come a long way since it was first developed by Linus Torvalds for Linux kernel development.",
      published_year: 2014,
      average_rating: 4.5,
      num_pages: 456,
      embedding: [],
      prerequisites: [9781491960202], // Learning Web Design
    },

    // Level 3 - Frontend Frameworks
    {
      id: "react-up-running",
      isbn13: 9781491931820,
      isbn10: 1491931825,
      title: "React: Up & Running",
      subtitle: "Building Web Applications",
      author: "Stoyan Stefanov",
      categories: "React, JavaScript, Frontend",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Hit the ground running with React, the open-source technology from Facebook for building rich web applications fast. With this practical guide, you'll quickly learn why developers are reaching for React.",
      published_year: 2021,
      average_rating: 4.2,
      num_pages: 254,
      embedding: [],
      prerequisites: [9781593279509], // Eloquent JavaScript
    },
    {
      id: "modern-javascript",
      isbn13: 9781593279851,
      isbn10: 1593279858,
      title: "The Modern JavaScript Tutorial",
      subtitle: "How to Code in JavaScript",
      author: "Ilya Kantor",
      categories: "JavaScript, Modern Web Development",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Learn modern JavaScript, from the basics to advanced topics with simple, but detailed explanations. The tutorial is divided into two parts which cover JavaScript as a programming language and working with a browser.",
      published_year: 2020,
      average_rating: 4.4,
      num_pages: 542,
      embedding: [],
      prerequisites: [9781449372637], // CSS Secrets
    },
    {
      id: "vue-js-action",
      isbn13: 9781617294624,
      isbn10: 1617294624,
      title: "Vue.js in Action",
      subtitle: "",
      author: "Erik Hanchett, Benjamin Listwon",
      categories: "Vue.js, JavaScript, Frontend",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Vue.js in Action teaches you how to build a fast, flowing web UI with the Vue.js framework. As you move through the book, you'll put your skills to practice by building a complete web store application.",
      published_year: 2018,
      average_rating: 4.3,
      num_pages: 304,
      embedding: [],
      prerequisites: [9781484200773], // Pro Git
    },

    // Level 4 - Backend Development
    {
      id: "nodejs-design-patterns",
      isbn13: 9781839214110,
      isbn10: 1839214112,
      title: "Node.js Design Patterns",
      subtitle: "Design and implement production-grade Node.js applications",
      author: "Mario Casciaro, Luciano Mammino",
      categories: "Node.js, Backend, Design Patterns",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Learn proven patterns, techniques, and tricks to take full advantage of the Node.js platform. Today the web is a mature platform that has grown considerably in terms of the expectations of its users.",
      published_year: 2020,
      average_rating: 4.4,
      num_pages: 664,
      embedding: [],
      prerequisites: [9781491931820], // React: Up & Running
    },
    {
      id: "learning-sql",
      isbn13: 9781492057611,
      isbn10: 1492057614,
      title: "Learning SQL",
      subtitle: "Generate, Manipulate, and Retrieve Data",
      author: "Alan Beaulieu",
      categories: "SQL, Databases",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "As data floods into your company, you need to put it to work right away—and SQL is the best tool for the job. With the latest edition of this introductory guide, author Alan Beaulieu helps developers get up to speed with SQL fundamentals.",
      published_year: 2020,
      average_rating: 4.3,
      num_pages: 366,
      embedding: [],
      prerequisites: [9781593279851], // Modern JavaScript Tutorial
    },
    {
      id: "express-in-action",
      isbn13: 9781617292422,
      isbn10: 1617292427,
      title: "Express in Action",
      subtitle: "Writing, Building, and Testing Node.js Applications",
      author: "Evan Hahn",
      categories: "Express.js, Node.js, Backend",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Express in Action is a carefully designed tutorial that teaches you how to build web applications using Node and Express. It starts by introducing Node's unique benefits and shows you how it's different from other web application frameworks.",
      published_year: 2016,
      average_rating: 4.2,
      num_pages: 256,
      embedding: [],
      prerequisites: [9781617294624], // Vue.js in Action
    },

    // Level 5 - Full-Stack Skills
    {
      id: "rest-api-design",
      isbn13: 9781449358063,
      isbn10: 1449358063,
      title: "REST API Design Rulebook",
      subtitle: "Designing Consistent RESTful Web Service Interfaces",
      author: "Mark Masse",
      categories: "REST API, Web Services",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "In today's market, where rival web services compete for attention, a well-designed REST API is a powerful differentiator. This concise book presents a set of API design rules, drawn primarily from best practices that stick.",
      published_year: 2011,
      average_rating: 4.1,
      num_pages: 116,
      embedding: [],
      prerequisites: [9781839214110, 9781492057611], // Node.js Design Patterns, Learning SQL
    },
    {
      id: "auth0-handbook",
      isbn13: 9781617295638,
      isbn10: 1617295639,
      title: "OAuth 2 in Action",
      subtitle: "",
      author: "Justin Richer, Antonio Sanso",
      categories: "Authentication, Security, OAuth",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "OAuth 2 in Action teaches you practical use and deployment of OAuth 2 from the perspectives of a client, an authorization server, and a resource server. You'll learn how to confidently and securely build and deploy OAuth on both the client and server sides.",
      published_year: 2017,
      average_rating: 4.3,
      num_pages: 360,
      embedding: [],
      prerequisites: [9781617292422], // Express in Action
    },

    // Level 6 - Advanced Topics
    {
      id: "high-performance-browser",
      isbn13: 9781449344764,
      isbn10: 1449344763,
      title: "High Performance Browser Networking",
      subtitle: "What every web developer should know about networking and web performance",
      author: "Ilya Grigorik",
      categories: "Performance, Networking, Web Development",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "How prepared are you to build fast and efficient web applications? This eloquent book provides what every web developer should know about the network, from fundamental limitations that affect performance to major innovations for building even more powerful browser applications.",
      published_year: 2013,
      average_rating: 4.6,
      num_pages: 400,
      embedding: [],
      prerequisites: [9781449358063], // REST API Design Rulebook
    },
    {
      id: "web-application-security",
      isbn13: 9781492053101,
      isbn10: 1492053104,
      title: "Web Application Security",
      subtitle: "Exploitation and Countermeasures for Modern Web Applications",
      author: "Andrew Hoffman",
      categories: "Security, Web Development",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "While many resources for network and IT security are available, detailed knowledge regarding modern web application security has been lacking—until now. This practical guide provides both offensive and defensive security concepts that software engineers can easily learn and apply.",
      published_year: 2020,
      average_rating: 4.4,
      num_pages: 350,
      embedding: [],
      prerequisites: [9781617295638], // OAuth 2 in Action
    },

    // Level 7 - Professional Development
    {
      id: "building-microservices",
      isbn13: 9781491950357,
      isbn10: 1491950358,
      title: "Building Microservices",
      subtitle: "Designing Fine-Grained Systems",
      author: "Sam Newman",
      categories: "Microservices, Architecture, Web Development",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Distributed systems have become more fine-grained as organizations shift from code-heavy monolithic applications to smaller, self-contained microservices. But developing these systems brings its own set of headaches.",
      published_year: 2015,
      average_rating: 4.3,
      num_pages: 280,
      embedding: [],
      prerequisites: [9781449344764, 9781492053101], // High Performance Browser Networking, Web Application Security
    },
    {
      id: "testing-javascript",
      isbn13: 9781617297915,
      isbn10: 1617297917,
      title: "Testing JavaScript Applications",
      subtitle: "Human-Quality and Error-Free Code",
      author: "Lucas da Costa",
      categories: "Testing, JavaScript, Quality Assurance",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Testing JavaScript Applications is a guide to building a comprehensive testing pipeline for your JavaScript applications. You'll learn to integrate testing throughout your development process and catch bugs before they reach production.",
      published_year: 2021,
      average_rating: 4.5,
      num_pages: 512,
      embedding: [],
      prerequisites: [9781491950357], // Building Microservices
    }
  ] as BookNode[]
}