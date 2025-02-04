import * as SQLite from 'expo-sqlite';
import { Recipe } from '../Models/Recipe';
import { deleteDatabase } from 'react-native-sqlite-storage';
import { DATABASE_NAME } from '../Library/generalConstants';
import * as FileSystem from 'expo-file-system';

export class LocalDatabase {
    private db: SQLite.SQLiteDatabase | null = null;

    public constructor() {
        this.InitializeDatabase();
    }

    public async GetAll(): Promise<Recipe[]> {
        const db = await this.GetDatabaseConnection();

        const rows = await db.getAllAsync('SELECT * FROM recipes;');
        return rows.map((row: any): Recipe => ({
            id: row.id,
            title: row.title,
            ingredients: row.ingredients.split(', '),
            category: row.category,
            date: new Date(row.creationDate),
            rating: row.rating,
        }));
    }

    public async Get(id: number): Promise<Recipe | null> {
        const db = await this.GetDatabaseConnection();
        const row: any = await db.getFirstAsync('SELECT * FROM recipes WHERE id = ?;', id);
        if (!row) return null;

        return {
            id: row.id,
            title: row.title,
            ingredients: row.ingredients.split(', '),
            category: row.category,
            date: new Date(row.creationDate),
            rating: row.rating,
        };
    }

    public async AddOrUpdateRecipe(recipe: Recipe): Promise<void> {
        const db = await this.GetDatabaseConnection();
        const ingredientsStr: string = recipe.ingredients.join(', ');

        const existingRecipe: Recipe | null = await this.Get(recipe.id);
        if (existingRecipe) {
            try {
                await db.runAsync(`
                    UPDATE recipes
                    SET title = ?, ingredients = ?, category = ?, creationDate = ?, rating = ?
                    WHERE id = ?;
                `, recipe.title, ingredientsStr, recipe.category, recipe.date.toISOString(), recipe.rating, recipe.id);
            }
            catch (error) {
                console.log("Error updating recipe in database", recipe);
            }
        } else {
            try {
                await db.runAsync(`
                    INSERT OR REPLACE INTO recipes (id, title, ingredients, category, creationDate, rating)
                    VALUES (?, ?, ?, ?, ?, ?);
                    `, recipe.id, recipe.title, ingredientsStr, recipe.category, recipe.date.toISOString(), recipe.rating);
            }
            catch (error) {
                console.log("Error adding recipe to database", error);
            }
        }
    }

    public async Delete(id: number): Promise<void> {
        const db = await this.GetDatabaseConnection();
        try {
            await db.runAsync('DELETE FROM recipes WHERE id = ?;', id);
            console.log(`Recipe with id ${id} deleted.`);
        } catch (error) {
            console.log("Error deleting recipe from database", error);
        }
    }

    private async InitializeDatabase(): Promise<void> {
        const db = await this.GetDatabaseConnection();
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

    private async GetDatabaseConnection(): Promise<SQLite.SQLiteDatabase> {
        if (!this.db) {
            this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        }

        return this.db;
    }

    private async ResetDatabase(): Promise<void> {
        const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;

        try {
            const dbInfo = await FileSystem.getInfoAsync(dbPath);
            if (dbInfo.exists) {
                await FileSystem.deleteAsync(dbPath);
                console.log("Database deleted successfully. Restart the app to recreate it.");
            } else {
                console.log("Database does not exist, nothing to delete.");
            }
        } catch (error) {
            console.log("Error deleting database:", error);
        }
    };
}
