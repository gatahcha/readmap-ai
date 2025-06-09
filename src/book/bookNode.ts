// Book node for Readmap AI
export interface bookNode {
    id? : string,
    isbn13 : Number,
    isbn10 : Number,
    title : String,
    subtitle : String,
    author : String,
    categories : String,
    thumbail : String, // link to the picture
    description : String,
    published_year : Number,
    average_rating : Number,
    num_page : Number,
    prevNode?: bookNode[]; // array of previous nodes
}