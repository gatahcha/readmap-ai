// data/examples/index.ts

// 1. Import all individual examples
import { machineLearningExample } from './machine-learning'  
import { dataScienceExample } from './data-science'
import { frenchCulinaryExample } from './french-culinary'
import { businessExample } from './business-basic'

// 2. Create a lookup object that maps topic names to examples
export const predefinedExamples = {
  "Machine Learning": machineLearningExample,
  "Data Science": dataScienceExample,
  "French Culinary Arts": frenchCulinaryExample,
  "Business Fundamentals": businessExample
}

// 3. Helper function to get example by topic name
export function getExampleByTopic(topic: string) {
  return predefinedExamples[topic as keyof typeof predefinedExamples]
}

// 4. List of trending topics for the UI
export const trendingTopics = [
  "Machine Learning", 
  "Data Science",
  "French Culinary Arts",
  "Business Fundamentals"
]

// 5. Type for the example structure
export interface ExampleData {
  query: string
  roadmapTitle: string
  books: import("@/book/bookNode").BookNode[]
}