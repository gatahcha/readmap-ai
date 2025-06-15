import type { BookNode } from "@/book/bookNode"

export const businessExample = {
    query: "business fundamentals and management principles",
    roadmapTitle: `Business Fundamentals: A Comprehensive Roadmap`,

    books: [
        {
            "id": "understanding-business",
            "isbn13": 9781260894851,
            "isbn10": 1260894851,
            "title": "Understanding Business",
            "subtitle": "",
            "author": "William G. Nickels; James McHugh; Susan McHugh",
            "categories": "Business, Introduction",
            "thumbnail": "https://dynamic.indigoimages.ca/v1/books/books/1260894851/1.jpg",
            "description": "A comprehensive introduction to business covering economics, management, marketing, finance, and other core concepts, designed for beginning business students.",
            "published_year": 2021,
            "average_rating": 4.40,
            "num_pages": 800,
            "embedding": [],
            "prerequisites": []
        },
        {
            "id": "marketing-management",
            "isbn13": 9780133856460,
            "isbn10": "0133856461",
            "title": "Marketing Management",
            "subtitle": "",
            "author": "Philip Kotler; Kevin Lane Keller",
            "categories": "Business, Marketing",
            "thumbnail": "https://dynamic.indigoimages.ca/v1/books/books/0133856461/1.jpg",
            "description": "A definitive textbook on marketing strategy and analysis, covering market research, consumer behavior, brand management and marketing planning with numerous real-world examples.",
            "published_year": 2016,
            "average_rating": 4.40,
            "num_pages": 816,
            "embedding": [],
            "prerequisites": [9781260894851]
        },
        {
            "id": "principles-of-corporate-finance",
            "isbn13": 9781260013900,
            "isbn10": "1260013901",
            "title": "Principles of Corporate Finance",
            "subtitle": "",
            "author": "Richard A. Brealey; Stewart C. Myers; Franklin Allen",
            "categories": "Business, Finance",
            "thumbnail": "https://dynamic.indigoimages.ca/v1/books/books/1260013901/1.jpg",
            "description": "A classic text on corporate finance, explaining core concepts like present value, risk and return, capital budgeting, capital structure, and valuation in a clear and practical manner.",
            "published_year": 2019,
            "average_rating": 4.60,
            "num_pages": 992,
            "embedding": [],
            "prerequisites": [9781260894851]
        },
        {
            "id": "competitive-strategy",
            "isbn13": 9780684841489,
            "isbn10": "0684841487",
            "title": "Competitive Strategy",
            "subtitle": "Techniques for Analyzing Industries and Competitors",
            "author": "Michael E. Porter",
            "categories": "Business, Strategy",
            "thumbnail": "https://dynamic.indigoimages.ca/v1/books/books/0684841487/1.jpg",
            "description": "Porter’s landmark work introducing the framework of the Five Forces and generic competitive strategies, providing tools to analyze industry structure and competition.",
            "published_year": 1998,
            "average_rating": 4.20,
            "num_pages": 397,
            "embedding": [],
            "prerequisites": [9781260894851]
        },
        {
            "id": "the-innovators-dilemma",
            "isbn13": 9780062060242,
            "isbn10": "0062060244",
            "title": "The Innovator’s Dilemma",
            "subtitle": "When New Technologies Cause Great Firms to Fail",
            "author": "Clayton M. Christensen",
            "categories": "Business, Innovation",
            "thumbnail": "https://dynamic.indigoimages.ca/v1/books/books/0062060244/1.jpg",
            "description": "A groundbreaking book on disruptive innovation, explaining why industry-leading companies often fail to capitalize on new technologies and outlining strategies to succeed in changing markets.",
            "published_year": 2011,
            "average_rating": 4.00,
            "num_pages": 336,
            "embedding": [],
            "prerequisites": [9781260894851]
        }
    ] as BookNode[]
}
