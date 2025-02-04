import axios, { AxiosResponse } from "axios";
import { Sources } from "../Library/Enums/Sources";
import { IP_ADDRESS, PORT } from "../Library/generalConstants";
import { CustomResponse } from "../Models/CustomResponse";
import { Recipe } from "../Models/Recipe";
import { LocalDatabase } from "../Repositories/localDatabase";

export class RecipeService {
    private readonly _baseUrl: string = `http://${IP_ADDRESS}:${PORT}`;
    private localDatabase: LocalDatabase;

    constructor(localDatabase: LocalDatabase) {
        this.localDatabase = localDatabase;
    }

    public async GetAll(): Promise<CustomResponse<Recipe[]>> {
        try {
            const response: AxiosResponse<Recipe[]> = await axios.get(`${this._baseUrl}/recipes`);

            await Promise.all(response.data.map(async (recipe) => {
                await this.localDatabase.AddOrUpdateRecipe(this.mapRecipe(recipe));
            }));

            return {
                data: this.mapRecipeIngredients(response.data),
                source: Sources.NETWORK
            };
        }
        catch (error) {
            console.log('Network request failed, falling back to local database:', error);
            const localRecipes: Recipe[] = await this.localDatabase.GetAll();

            if (localRecipes.length === 0) {
                console.log('No recipes found in local database.');
                throw new Error('No recipes found in local database.');
            }

            return {
                data: localRecipes,
                source: Sources.LOCAL
            };
        }
    }

    public async Get(id: number): Promise<CustomResponse<Recipe>> {
        try {
            const response: AxiosResponse<Recipe> = await axios.get<Recipe>(`${this._baseUrl}/recipe/${id}`);
            await this.localDatabase.AddOrUpdateRecipe(this.mapRecipe(response.data));
            return {
                data: this.mapRecipe(response.data),
                source: Sources.NETWORK
            }
        }
        catch (error) {
            console.log('Network request failed, falling back to local database:', error);
            const localRecipe: Recipe | null = await this.localDatabase.Get(id);

            if (!localRecipe) {
                console.log('Recipe not found in local database.');
                throw new Error('Recipe not found in local database.');
            }

            return {
                data: localRecipe,
                source: Sources.LOCAL
            }
        }
    }

    public async Create(recipe: Recipe): Promise<Recipe> {
        const networkRecipe: any = {
            ...recipe,
            date: recipe.date.toISOString(),
            ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : ""
        };
        const response = await axios.post<Recipe>(`${this._baseUrl}/recipe`, networkRecipe);
        return this.mapRecipe(response.data);
    }

    public async Update(recipe: Recipe): Promise<Recipe> {
        const networkRecipe: any = {
            ...recipe,
            date: recipe.date.toISOString(),
            ingredients: recipe.ingredients.join(", ")
        };
        console.log("network recipe: ", networkRecipe);
        const response = await axios.put<Recipe>(`${this._baseUrl}/recipe/${recipe.id}`, networkRecipe);
        return this.mapRecipe(response.data);
    }

    public async Delete(id: number): Promise<void> {
        await axios.delete(`${this._baseUrl}/recipe/${id}`);
        await this.localDatabase.Delete(id);
    }

    // MANAREALA CA MI-A FOST LENE SA SCHIMB CA recipe.ingredients e string si nu string[]
    private mapRecipeIngredients(recipe: Recipe[]): Recipe[] {
        return recipe.map((recipe: Recipe) => ({
            ...recipe,
            ingredients: (recipe.ingredients as unknown as string).split(", ")
        }));
    }

    // MANAREALA CA MI-A FOST LENE SA SCHIMB CA recipe.ingredients e string si nu string[]
    private mapRecipe(networkRecipe: any): Recipe {
        return {
            ...networkRecipe,
            date: new Date(networkRecipe.date),
            ingredients: (networkRecipe.ingredients as unknown as string).split(", ")
        };
    }
}