export type CategoryId =
  | "coffee"
  | "matcha"
  | "food"
  | "milktea"
  | "drinks"
  | "bread"
  | "juice";

export interface Category {
  id: CategoryId;
  name: string;
  image: string;
  desc: string
}
