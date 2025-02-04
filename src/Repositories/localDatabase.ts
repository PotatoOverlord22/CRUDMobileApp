import * as SQLite from 'expo-sqlite';
import { Recipe } from '../Models/Recipe';

export class LocalDatabase {
    private db: SQLite.SQLiteDatabase | null = null;

    public constructor() {
        this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<void> {
        const db = await this.getDatabaseConnection();
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                ingredients TEXT NOT NULL,
                category TEXT NOT NULL,
                creationDate TEXT NOT NULL,
                rating REAL NOT NULL
            );
        `);

        console.log('Database initialized: recipes table created.');
    }

    private async getDatabaseConnection(): Promise<SQLite.SQLiteDatabase> {
        if (!this.db) {
            this.db = await SQLite.openDatabaseAsync('recipes.db');
        }

        return this.db;
    }

    public async GetAll(): Promise<Recipe[]> {
        const db = await this.getDatabaseConnection();
        const rows = await db.getAllAsync('SELECT * FROM recipes;');
        console.error('rows', rows);
        return rows.map((row: any): Recipe => ({
            id: row.id,
            title: row.title,
            ingredients: row.ingredients.split(', '),
            category: row.category,
            creationDate: new Date(row.creationDate),
            rating: row.rating,
        }));
    }

    public async Get(id: number): Promise<Recipe | null> {
        const db = await this.getDatabaseConnection();
        const row: any = await db.getFirstAsync('SELECT * FROM recipes WHERE id = ?;', id);
        if (!row) return null;

        return {
            id: row.id,
            title: row.title,
            ingredients: row.ingredients.split(', '),
            category: row.category,
            creationDate: new Date(row.creationDate),
            rating: row.rating,
        };
    }

    public async AddOrUpdateRecipe(recipe: Recipe): Promise<void> {
        const db = await this.getDatabaseConnection();
        const ingredientsStr: string = recipe.ingredients.join(', ');

        const existingRecipe: Recipe | null = await this.Get(recipe.id);

        console.log('recipe', recipe);

        if (existingRecipe) {
            await db.runAsync(`
                UPDATE recipes
                SET title = ?, ingredients = ?, category = ?, creationDate = ?, rating = ?
                WHERE id = ?;
            `, recipe.title, ingredientsStr, recipe.category, recipe.creationDate.toISOString(), recipe.rating, recipe.id);

            const row = await db.runAsync(`
                SELECT * FROM recipes WHERE id = ?;
            `, recipe.id);
            console.log('row', row);
        } else {
            try {
                await db.runAsync(`
                    INSERT INTO recipes (id, title, ingredients, category, creationDate, rating)
                    VALUES (?, ?, ?, ?, ?, ?);
                    `, recipe.id, recipe.title, ingredientsStr, recipe.category, recipe.creationDate as unknown as string, recipe.rating);
            }
            catch (error) {
                console.error("Error adding recipe to database", error);
            }
        }
    }
}
