import { Cocktail } from "./coktail.interface";

export interface CocktailDetails extends Cocktail {
  ingredientsString: string
  isFavorite?: boolean;
}
