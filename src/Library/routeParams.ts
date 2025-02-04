import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Recipe } from "../Models/Recipe";
import { InternalRoutes } from "./Enums/InternalRoutes";
import { ViewModes } from "./Enums/ViewModes";

export type StackParamList = {
    [InternalRoutes.TabNavigator]: undefined;
    [InternalRoutes.RecipeEdit]: { recipeId?: number, viewMode: ViewModes };
};

export type StackNavigatorType = NativeStackNavigationProp<StackParamList>;
export type RecipeEditNavigationProps = NativeStackScreenProps<StackParamList, InternalRoutes.RecipeEdit>;