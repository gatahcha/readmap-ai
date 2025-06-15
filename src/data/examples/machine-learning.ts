import type { BookNode } from "@/book/bookNode"

export const machineLearningExample = {
  query: "Machine Learning",
  finalResponse: `We found some excellent books for learning Machine Learning organized by learning levels:

**Level 1 - Foundations:** Start with Python programming and basic mathematics
**Level 2 - Core Concepts:** Learn fundamental ML algorithms and statistics  
**Level 3 - Practical Applications:** Master scikit-learn and real-world projects
**Level 4 - Deep Learning:** Neural networks and deep learning frameworks
**Level 5 - Advanced Topics:** Specialized areas like NLP and computer vision
**Level 6 - Research & Production:** Latest techniques and deployment strategies

Follow this progressive learning path to master Machine Learning from beginner to expert level!`,

  books: [
    // Level 1 - Foundational Books
    {
      id: "python-crash-course",
      isbn13: 9781593279288,
      isbn10: 1593279280,
      title: "Python Crash Course",
      subtitle: "A Hands-On, Project-Based Introduction to Programming",
      author: "Eric Matthes",
      categories: "Python, Programming",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Python Crash Course is a fast-paced, thorough introduction to Python that will have you writing programs, solving problems, and making things that work in no time.",
      published_year: 2019,
      average_rating: 4.5,
      num_pages: 544,
      embedding: [],
      prerequisites: [],
    },
    {
      id: "math-for-ml",
      isbn13: 9781108455145,
      isbn10: 1108455142,
      title: "Mathematics for Machine Learning",
      subtitle: "",
      author: "Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong",
      categories: "Mathematics, Machine Learning",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "The fundamental mathematical tools needed to understand machine learning include linear algebra, analytic geometry, matrix decompositions, vector calculus, optimization, probability and statistics.",
      published_year: 2020,
      average_rating: 4.3,
      num_pages: 398,
      embedding: [],
      prerequisites: [],
    },
    {
      id: "intro-statistical-learning",
      isbn13: 9781461471370,
      isbn10: 1461471370,
      title: "An Introduction to Statistical Learning",
      subtitle: "with Applications in R",
      author: "Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani",
      categories: "Statistics, Machine Learning",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "This book provides an introduction to statistical learning methods. It is aimed for upper level undergraduate students, masters students and Ph.D. students in the non-mathematical sciences.",
      published_year: 2013,
      average_rating: 4.4,
      num_pages: 426,
      embedding: [],
      prerequisites: [],
    },

    // Level 2 - Core Concepts
    {
      id: "hands-on-ml",
      isbn13: 9781492032649,
      isbn10: 1492032646,
      title: "Hands-On Machine Learning",
      subtitle: "with Scikit-Learn, Keras, and TensorFlow",
      author: "Aurélien Géron",
      categories: "Machine Learning, Python",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Through a series of recent breakthroughs, deep learning has boosted the entire field of machine learning. Now, even programmers who know close to nothing about this technology can use simple, efficient tools to implement programs capable of learning from data.",
      published_year: 2022,
      average_rating: 4.6,
      num_pages: 851,
      embedding: [],
      prerequisites: [9781593279288], // Python Crash Course
    },
    {
      id: "pattern-recognition-ml",
      isbn13: 9780387310732,
      isbn10: 387310738,
      title: "Pattern Recognition and Machine Learning",
      subtitle: "",
      author: "Christopher Bishop",
      categories: "Machine Learning, Pattern Recognition",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "This is the first textbook on pattern recognition to present the Bayesian viewpoint. The book presents approximate inference algorithms that permit fast approximate answers in situations where exact answers are not feasible.",
      published_year: 2006,
      average_rating: 4.3,
      num_pages: 738,
      embedding: [],
      prerequisites: [9781108455145], // Mathematics for Machine Learning
    },
    {
      id: "elements-statistical-learning",
      isbn13: 9780387848570,
      isbn10: 387848576,
      title: "The Elements of Statistical Learning",
      subtitle: "Data Mining, Inference, and Prediction",
      author: "Trevor Hastie, Robert Tibshirani, Jerome Friedman",
      categories: "Statistics, Machine Learning",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "This book describes the important ideas in a variety of fields such as medicine, biology, finance, and marketing in a common conceptual framework.",
      published_year: 2016,
      average_rating: 4.4,
      num_pages: 745,
      embedding: [],
      prerequisites: [9781461471370], // Introduction to Statistical Learning
    },

    // Level 3 - Practical Applications
    {
      id: "scikit-learn-cookbook",
      isbn13: 9781783989485,
      isbn10: 1783989483,
      title: "scikit-learn Cookbook",
      subtitle: "Over 50 recipes to incorporate scikit-learn into every step of the data science pipeline",
      author: "Trent Hauck",
      categories: "Machine Learning, Python",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "This book will teach you how to use scikit-learn to solve machine learning problems. You will learn various techniques that can be used to improve the performance of machine learning models.",
      published_year: 2014,
      average_rating: 4.1,
      num_pages: 212,
      embedding: [],
      prerequisites: [9781492032649], // Hands-On Machine Learning
    },
    {
      id: "feature-engineering",
      isbn13: 9781491953242,
      isbn10: 1491953241,
      title: "Feature Engineering for Machine Learning",
      subtitle: "Principles and Techniques for Data Scientists",
      author: "Alice Zheng, Amanda Casari",
      categories: "Machine Learning, Data Science",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Feature engineering is a crucial step in the machine-learning pipeline, yet this topic is rarely examined on its own. With this practical book, you'll learn techniques for extracting and transforming features.",
      published_year: 2018,
      average_rating: 4.2,
      num_pages: 218,
      embedding: [],
      prerequisites: [9781492032649], // Hands-On Machine Learning
    },

    // Level 4 - Deep Learning
    {
      id: "deep-learning-book",
      isbn13: 9780262035613,
      isbn10: 262035618,
      title: "Deep Learning",
      subtitle: "",
      author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
      categories: "Deep Learning, Neural Networks",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Written by three experts in the field, Deep Learning is the only comprehensive book on the subject. It provides mathematical and conceptual background, covering relevant concepts in linear algebra, probability theory and information theory.",
      published_year: 2016,
      average_rating: 4.5,
      num_pages: 800,
      embedding: [],
      prerequisites: [9780387310732, 9780387848570], // Pattern Recognition ML, Elements of Statistical Learning
    },
    {
      id: "deep-learning-python",
      isbn13: 9781617294433,
      isbn10: 1617294438,
      title: "Deep Learning with Python",
      subtitle: "",
      author: "François Chollet",
      categories: "Deep Learning, Python",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "Deep Learning with Python introduces the field of deep learning using the Python language and the powerful Keras library. Written by Keras creator and Google AI researcher François Chollet.",
      published_year: 2021,
      average_rating: 4.6,
      num_pages: 504,
      embedding: [],
      prerequisites: [9781783989485, 9781491953242], // scikit-learn Cookbook, Feature Engineering
    },

    // Level 5 - Advanced Topics
    {
      id: "nlp-python",
      isbn13: 9781491916216,
      isbn10: 1491916214,
      title: "Natural Language Processing with Python",
      subtitle: "Analyzing Text with the Natural Language Toolkit",
      author: "Steven Bird, Ewan Klein, Edward Loper",
      categories: "NLP, Python",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "This version of the book has been updated for Python 3 and NLTK 3. The first edition of this book was published in 2009 and became an instant classic.",
      published_year: 2019,
      average_rating: 4.2,
      num_pages: 524,
      embedding: [],
      prerequisites: [9780262035613], // Deep Learning
    },
    {
      id: "computer-vision",
      isbn13: 9781848829343,
      isbn10: 1848829345,
      title: "Computer Vision: Algorithms and Applications",
      subtitle: "",
      author: "Richard Szeliski",
      categories: "Computer Vision, Machine Learning",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "This book provides a comprehensive treatment of computer vision. It is accessible to both undergraduate and graduate students, as well as to researchers and practitioners in the field.",
      published_year: 2010,
      average_rating: 4.4,
      num_pages: 812,
      embedding: [],
      prerequisites: [9781617294433], // Deep Learning with Python
    },

    // Level 6 - Research & Production
    {
      id: "gans-in-action",
      isbn13: 9781617295560,
      isbn10: 1617295566,
      title: "GANs in Action",
      subtitle: "Deep Learning with Generative Adversarial Networks",
      author: "Jakub Langr, Vladimir Bok",
      categories: "Deep Learning, GANs",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "GANs in Action teaches you how to build and train your own Generative Adversarial Networks, one of the most important innovations in deep learning.",
      published_year: 2019,
      average_rating: 4.3,
      num_pages: 296,
      embedding: [],
      prerequisites: [9781491916216, 9781848829343], // NLP with Python, Computer Vision
    },
    {
      id: "ml-design-patterns",
      isbn13: 9781098115777,
      isbn10: 1098115775,
      title: "Machine Learning Design Patterns",
      subtitle: "Solutions to Common Challenges in Data Preparation, Model Building, and MLOps",
      author: "Valliappa Lakshmanan, Sara Robinson, Michael Munn",
      categories: "MLOps, Machine Learning",
      thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
      description: "The design patterns in this book capture best practices and solutions to recurring problems in machine learning. The authors, three Google engineers, catalog proven methods to help data scientists tackle common problems throughout the ML process.",
      published_year: 2020,
      average_rating: 4.5,
      num_pages: 408,
      embedding: [],
      prerequisites: [9781617295560], // GANs in Action
    }
  ] as BookNode[]
}