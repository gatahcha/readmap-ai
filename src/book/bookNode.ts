// Book node for Readmap AI
export interface bookNode {
    isbn13 : number,
    isbn10 : number,
    title : String,
    subtitle : String,
    author : String,
    categories : String,
    thumbail : String, // link to the picture
    description : String,
    published_year : number,
    average_rating : number,
    num_page : number,
    embedding: number[], // array of numbers with length 3072
    prevNodes : bookNode[] // array of previous nodes
}