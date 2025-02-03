import axios, { AxiosResponse } from "axios";
import { Recipe } from "../Models/Recipe";

const IP_ADDRESS: string = "192.168.16.115";
const PORT: number = 2528;

export class RecipeService {
    private readonly _baseUrl: string = `http://${IP_ADDRESS}:${PORT}`;

    public async GetAll(): Promise<Recipe[]> {
        const response: AxiosResponse<Recipe[]> = await axios.get(`${this._baseUrl}/recipes`);
        return this.mapRecipeIngredients(response.data);
    }

    public async Get(id: string): Promise<Recipe> {
        const response = await axios.get<Recipe>(`${this._baseUrl}/recipe/${id}`);
        return this.mapRecipe(response.data);
    }

    public async Create(recipe: Recipe): Promise<Recipe> {
        const response = await axios.post<Recipe>(`${this._baseUrl}/recipe`, recipe);
        return this.mapRecipe(response.data);
    }

    public async Update(recipe: Recipe): Promise<Recipe> {
        const response = await axios.put<Recipe>(`${this._baseUrl}/recipe/${recipe.id}`, recipe);
        return this.mapRecipe(response.data);
    }

    public async Delete(id: string): Promise<void> {
        await axios.delete(`${this._baseUrl}/recipe/${id}`);
    }

    // MANAREALA CA MI-A FOST LENE SA SCHIMB CA recipe.ingredients e string si nu string[]
    private mapRecipeIngredients(recipe: Recipe[]): Recipe[] {
        return recipe.map((recipe: Recipe) => ({
            ...recipe,
            ingredients: (recipe.ingredients as unknown as string).split(", ")
        }));
    }

    // MANAREALA CA MI-A FOST LENE SA SCHIMB CA recipe.ingredients e string si nu string[]
    private mapRecipe(recipe: Recipe): Recipe {
        return {
            ...recipe,
            ingredients: (recipe.ingredients as unknown as string).split(", ")
        };
    }
}