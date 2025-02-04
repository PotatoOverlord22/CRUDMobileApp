import axios, { AxiosResponse } from "axios";
import { Sources } from "../Library/Enums/Sources";
import { CustomResponse } from "../Models/CustomResponse";
import { Recipe } from "../Models/Recipe";
import { LocalDatabase } from "../Repositories/localDatabase";

const IP_ADDRESS: string = "192.168.16.115";
const PORT: number = 2528;

export class RecipeService {
    private readonly _baseUrl: string = `http://${IP_ADDRESS}:${PORT}`;
    private localDatabase: LocalDatabase;

    constructor(localDatabase: LocalDatabase) {
        this.localDatabase = localDatabase;
    }

    public async GetAll(): Promise<CustomResponse<Recipe[]>> {
        try {
            const response: AxiosResponse<Recipe[]> = await axios.get(`${this._baseUrl}/recipes`);

            response.data.forEach(async (recipe: Recipe) => {
                await this.localDatabase.AddOrUpdateRecipe(this.mapRecipe(recipe));
            });

            return {
                data: this.mapRecipeIngredients(response.data),
                source: Sources.NETWORK
            };
        }
        catch (error) {
            console.error('Network request failed, falling back to local database:', error);
            const localRecipes: Recipe[] = await this.localDatabase.GetAll();

            if (localRecipes.length === 0) {
                console.error('No recipes found in local database.');
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
            console.error('Network request failed, falling back to local database:', error);
            const localRecipe: Recipe | null = await this.localDatabase.Get(id);

            if (!localRecipe) {
                console.error('Recipe not found in local database.');
                throw new Error('Recipe not found in local database.');
            }

            return {
                data: localRecipe,
                source: Sources.LOCAL
            }
        }
    }

    public async Create(recipe: Recipe): Promise<Recipe> {
        const response = await axios.post<Recipe>(`${this._baseUrl}/recipe`, recipe);
        return this.mapRecipe(response.data);
    }

    public async Update(recipe: Recipe): Promise<Recipe> {
        const response = await axios.put<Recipe>(`${this._baseUrl}/recipe/${recipe.id}`, recipe);
        return this.mapRecipe(response.data);
    }

    public async Delete(id: number): Promise<void> {
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