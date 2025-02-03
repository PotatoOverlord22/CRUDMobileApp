import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, FAB, IconButton, List } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { ToastMethods, ToastOptions } from "react-native-paper-toast/dist/typescript/src/types";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { StackNavigatorType } from "../../Library/routeParams";
import { getErrorNotificationOptions, getSuccessNotificationOptions } from "../../Library/Utils/toastUtils";
import { Recipe } from "../../Models/Recipe";
import { IServices, useServices } from "../../Providers/servicesProvider";
import { CREATE_ICON, DELETE_ICON, EDIT_ICON, FETCH_RECIPES_ERROR_MESSAGE, FETCH_RECIPES_SUCCESS_MESSAGE, LIST_BUTTON_SIZE, LIST_ITEM_ICON, recipesStyles } from "./recipesList.styles";

const fetchRecipesSuccessNotification: ToastOptions = getSuccessNotificationOptions(FETCH_RECIPES_SUCCESS_MESSAGE);
const fetchRecipesErrorNotification: ToastOptions = getErrorNotificationOptions(FETCH_RECIPES_ERROR_MESSAGE);

export const RecipesList: React.FC = (): JSX.Element => {
    const services: IServices = useServices();
    const navigator: StackNavigatorType = useNavigation<StackNavigatorType>();
    const toaster: ToastMethods = useToast();
    const [recipes, setRecipes] = React.useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect((): void => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const data: Recipe[] = await services.RecipeService.GetAll();
            toaster.show(fetchRecipesSuccessNotification);
            setRecipes(data);
        }
        catch (error) {
            toaster.show(fetchRecipesErrorNotification);
        }
        finally {
            setIsLoading(false);
        }
    };

    const onCreate = (): void => {
        navigator.navigate(InternalRoutes.RecipeEdit, { isEditing: false });
    };

    const onViewDetails = (recipe: Recipe): void => {
        navigator.navigate(InternalRoutes.RecipeDetails, { recipe });
    };

    const onEdit = (recipe: Recipe): void => {
        navigator.navigate(InternalRoutes.RecipeEdit, { recipe, isEditing: true });
    };

    const onDelete = (recipe: Recipe): void => {

    };

    return (
        <View style={recipesStyles.mainContainer}>
            {isLoading ? (
                <View style={recipesStyles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true} size={"large"} />
                </View>
            ) : (
                <ScrollView>
                    {recipes.map((recipe: Recipe): JSX.Element => (
                        <List.Item
                            key={recipe.id}
                            title={recipe.title}
                            description={recipe.category}
                            onPress={(): void => onViewDetails(recipe)}
                            left={(props): JSX.Element => <List.Icon {...props} icon={LIST_ITEM_ICON} />}
                            right={(props): JSX.Element =>
                                <View style={recipesStyles.iconButtonContainer}>
                                    <IconButton
                                        {...props}
                                        icon={EDIT_ICON}
                                        size={LIST_BUTTON_SIZE}
                                        onPress={(): void => onEdit(recipe)}
                                    />
                                    <IconButton
                                        {...props}
                                        icon={DELETE_ICON}
                                        size={LIST_BUTTON_SIZE}
                                        onPress={(): void => onDelete(recipe)}
                                    />
                                </View>
                            }
                        />
                    ))}
                </ScrollView>
            )}
            <FAB
                icon={CREATE_ICON}
                onPress={onCreate}
                style={recipesStyles.fab}
            />
        </View>
    );

};