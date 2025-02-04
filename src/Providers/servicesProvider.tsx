import React, { createContext, useContext } from 'react';
import { RecipeService } from '../Services/recipeService';
import { LocalDatabase } from '../Repositories/localDatabase';

export interface IServices {
    RecipeService: RecipeService;
};

const ServicesContext = createContext<IServices | undefined>(undefined);

export const useServices = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServices must be used within a ServicesProvider');
    }

    return context;
};

export const ServicesProvider: React.FC<React.PropsWithChildren> = (props: React.PropsWithChildren) => {
    const localDatabase: LocalDatabase = new LocalDatabase();
    const recipeService: RecipeService = new RecipeService(localDatabase);

    return (
        <ServicesContext.Provider value={{ RecipeService: recipeService }}>
            {props.children}
        </ServicesContext.Provider>
    );
};