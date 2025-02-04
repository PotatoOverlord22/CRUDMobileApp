import { addEventListener } from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, FAB, IconButton, List, Text } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { ToastMethods, ToastOptions } from "react-native-paper-toast/dist/typescript/src/types";
import { ConnectionStates } from "../../Library/Enums/ConnectionStates";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { Sources } from "../../Library/Enums/Sources";
import { NO_INTERNET_MESSAGE, RETRY } from "../../Library/generalConstants";
import { StackNavigatorType } from "../../Library/routeParams";
import { getErrorNotificationOptions, getSuccessNotificationOptions } from "../../Library/Utils/toastUtils";
import { CustomResponse } from "../../Models/CustomResponse";
import { Recipe } from "../../Models/Recipe";
import { IServices, useServices } from "../../Providers/servicesProvider";
import { CREATE_ICON, DELETE_ICON, DELETE_RECIPE_ERROR_MESSAGE, DELETE_RECIPE_SUCCESS_MESSAGE, EDIT_ICON, FETCH_RECIPES_ERROR_MESSAGE, FETCH_RECIPES_SUCCESS_MESSAGE, LIST_BUTTON_SIZE, LIST_ITEM_ICON, recipesStyles } from "./recipesList.styles";

const fetchRecipesSuccessNotification: ToastOptions = getSuccessNotificationOptions(FETCH_RECIPES_SUCCESS_MESSAGE);
const fetchRecipesErrorNotification: ToastOptions = getErrorNotificationOptions(FETCH_RECIPES_ERROR_MESSAGE);
const deleteRecipesSuccessNotification: ToastOptions = getSuccessNotificationOptions(DELETE_RECIPE_SUCCESS_MESSAGE);
const deleteRecipesErrorNotification: ToastOptions = getErrorNotificationOptions(DELETE_RECIPE_ERROR_MESSAGE);

export const RecipesList: React.FC = (): JSX.Element => {
    const services: IServices = useServices();
    const navigator: StackNavigatorType = useNavigation<StackNavigatorType>();
    const toaster: ToastMethods = useToast();
    const [recipes, setRecipes] = React.useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [connectionStatus, setConnectionStatus] = React.useState<ConnectionStates>(ConnectionStates.OFFLINE);

    React.useEffect((): void => {
        const unsubscribe = addEventListener((state): void => {
            console.log("connection change: ", state.isConnected);
            fetchRecipes();
        });
    }, []);

    React.useEffect((): void => {
        console.log("connectionStatus", connectionStatus);
    }, [connectionStatus]);

    const fetchRecipes = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const serviceResponse: CustomResponse<Recipe[]> = await services.RecipeService.GetAll();
            if (serviceResponse.source === Sources.NETWORK) {
                setConnectionStatus(ConnectionStates.ONLINE);
                toaster.show(fetchRecipesSuccessNotification);
            }
            else if (serviceResponse.source === Sources.LOCAL) {
                toaster.show(getErrorNotificationOptions("No internet connection, showing cached data."));
                setConnectionStatus(ConnectionStates.LOCAL);
            }

            setRecipes(serviceResponse.data);
        }
        catch (error) {
            toaster.show(fetchRecipesErrorNotification);
            setConnectionStatus(ConnectionStates.OFFLINE);
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

    const onDelete = async (recipe: Recipe): Promise<void> => {
        try {
            await services.RecipeService.Delete(recipe.id);
            toaster.show(deleteRecipesSuccessNotification);
            setRecipes((prevRecipies: Recipe[]): Recipe[] => prevRecipies.filter((r: Recipe): boolean => r.id !== recipe.id));
        }
        catch (error) {
            toaster.show(deleteRecipesErrorNotification);
        }
    };

    if (connectionStatus === ConnectionStates.OFFLINE) {
        return (
            <View style={recipesStyles.noInternetContainer}>
                <Text>{NO_INTERNET_MESSAGE}</Text>
                <Button mode="contained" onPress={fetchRecipes}>
                    {RETRY}
                </Button>
            </View>
        );
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
                                        disabled={connectionStatus !== ConnectionStates.ONLINE}
                                    />
                                    <IconButton
                                        {...props}
                                        icon={DELETE_ICON}
                                        size={LIST_BUTTON_SIZE}
                                        onPress={(): void => { void onDelete(recipe); }}
                                        disabled={connectionStatus !== ConnectionStates.ONLINE}
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
                disabled={connectionStatus !== ConnectionStates.ONLINE}
            />
        </View>
    );
};