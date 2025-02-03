import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Recipe } from "../Models/Recipe";
import { InternalRoutes } from "./Enums/InternalRoutes";

export type StackParamList = {
    [InternalRoutes.TabNavigator]: undefined;
    [InternalRoutes.RecipeDetails]: { recipe: Recipe };
    [InternalRoutes.RecipeEdit]: { recipe?: Recipe, isEditing: boolean };
};

export type StackNavigatorType = NativeStackNavigationProp<StackParamList>;
export type RecipesDetailsNavigationProps = NativeStackScreenProps<StackParamList, InternalRoutes.RecipeDetails>;
export type RecipeEditNavigationProps = NativeStackScreenProps<StackParamList, InternalRoutes.RecipeEdit>;