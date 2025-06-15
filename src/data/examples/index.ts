// data/examples/index.ts

// 1. Import all individual examples
import { webDevelopmentExample } from './web-development'
import { machineLearningExample } from './machine-learning'  
import { dataScienceExample } from './data-science'

// 2. Create a lookup object that maps topic names to examples
export const predefinedExamples = {
  "Web Development": webDevelopmentExample,
  "Machine Learning": machineLearningExample,
  "Data Science": dataScienceExample
}

// 3. Helper function to get example by topic name
export function getExampleByTopic(topic: string) {
  return predefinedExamples[topic as keyof typeof predefinedExamples]
}

// 4. List of trending topics for the UI
export const trendingTopics = [
  "Machine Learning",
  "Web Development", 
  "Data Science"
]

// 5. Type for the example structure
export interface ExampleData {
  query: string
  finalResponse: string
  books: import("@/book/bookNode").BookNode[]
}