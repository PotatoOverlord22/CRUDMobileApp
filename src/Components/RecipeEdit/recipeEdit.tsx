import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { useToast } from "react-native-paper-toast";
import { ToastMethods, ToastOptions } from "react-native-paper-toast/dist/typescript/src/types";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { ViewModes } from "../../Library/Enums/ViewModes";
import { RecipeEditNavigationProps } from "../../Library/routeParams";
import { getErrorNotificationOptions, getSuccessNotificationOptions } from "../../Library/Utils/toastUtils";
import { CustomResponse } from "../../Models/CustomResponse";
import { Recipe } from "../../Models/Recipe";
import { IServices, useServices } from "../../Providers/servicesProvider";
import { CANCEL, CREATE_RECIPE, CREATE_SUCCESSFUL_MESSAGE, EDIT_RECIPE, EDIT_SUCCESSFUL_MESSAGE, getRecipeEditStyles, SAVE, SAVE_FAILED_MESSAGE, VIEW_RECIPE } from "./recipeEdit.styles";

const defaultRecipe: Recipe = {
    id: -1,
    title: "",
    ingredients: [],
    category: "",
    date: new Date(),
    rating: 0
};

const createSuccessToast: ToastOptions = getSuccessNotificationOptions(CREATE_SUCCESSFUL_MESSAGE);
const editSuccessToast: ToastOptions = getSuccessNotificationOptions(EDIT_SUCCESSFUL_MESSAGE);
const saveFailedToast: ToastOptions = getErrorNotificationOptions(SAVE_FAILED_MESSAGE);
const fetchFailedToast: ToastOptions = getErrorNotificationOptions(SAVE_FAILED_MESSAGE);

export const RecipeEdit: React.FC<RecipeEditNavigationProps> = (props: RecipeEditNavigationProps): JSX.Element => {
    const insets: EdgeInsets = useSafeAreaInsets();
    const viewMode: ViewModes = props.route.params.viewMode;
    const toaster: ToastMethods = useToast();
    const services: IServices = useServices();
    const [recipe, setRecipe] = useState<Recipe>(defaultRecipe);
    const recipeEditStyles = getRecipeEditStyles(insets);

    React.useEffect((): void => {
        fetchRecipe();
    }, []);

    const fetchRecipe = async (): Promise<void> => {
        if (!props.route.params.recipeId) {
            return;
        }

        try {
            const response: CustomResponse<Recipe> = await services.RecipeService.Get(props.route.params.recipeId);
            setRecipe(response.data);
        }
        catch (error) {
            console.log(`Failed to fetch recipe: `, error);
            toaster.show(fetchFailedToast);
        }
    };

    const onInputChange = (field: keyof Recipe, value: string | string[] | number | Date) => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            [field]: value,
        }));
    };

    const onSave = async (): Promise<void> => {
        try {
            switch (viewMode) {
                case ViewModes.CREATE:
                    console.log("recipe: ", recipe);
                    await services.RecipeService.Create(recipe);
                    // toaster.show(createSuccessToast);
                    props.navigation.navigate(InternalRoutes.TabNavigator);
                    break;
                case ViewModes.EDIT:
                    await services.RecipeService.Update(recipe);
                    toaster.show(editSuccessToast);
                    props.navigation.navigate(InternalRoutes.TabNavigator);
                    break;
            }
        }
        catch (error) {
            console.log(`Failed to ${viewMode} recipe: `, error);
            toaster.show(saveFailedToast);
        }
    };

    const onCancel = (): void => {
        props.navigation.goBack();
    };

    const getViewTitle = (): string => {
        switch (viewMode) {
            case ViewModes.CREATE:
                return CREATE_RECIPE;
            case ViewModes.EDIT:
                return EDIT_RECIPE;
            case ViewModes.VIEW:
                return VIEW_RECIPE;
            default:
                return "";
        };
    };

    return (
        <SafeAreaView style={recipeEditStyles.container}>
            <ScrollView>
                <Text variant="headlineLarge" style={recipeEditStyles.input}>
                    {getViewTitle()}
                </Text>
                <TextInput
                    label={"Title"}
                    value={recipe.title}
                    onChangeText={(text) => onInputChange("title", text)}
                    style={recipeEditStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label="Category"
                    value={recipe.category}
                    onChangeText={(text) => onInputChange("category", text)}
                    style={recipeEditStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label="Ingredients (comma separated)"
                    value={recipe.ingredients?.join(", ") ?? ""}
                    onChangeText={(text) => onInputChange("ingredients", text.split(", "))}
                    style={recipeEditStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label="Rating"
                    value={recipe.rating ? recipe.rating.toString() : ""}
                    keyboardType="numeric"
                    onChangeText={(text) => onInputChange("rating", parseFloat(text))}
                    style={recipeEditStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <DatePickerInput
                    label="Creation Date"
                    locale="en"
                    value={recipe.date}
                    onChange={(date: CalendarDate): void => onInputChange("date", date ?? new Date())}
                    inputMode="start"
                    disabled={viewMode === ViewModes.VIEW}
                />

                {viewMode !== ViewModes.VIEW && (
                    <View style={recipeEditStyles.buttonContainer}>
                        <Button mode="contained" onPress={onSave} style={recipeEditStyles.button}>
                            {SAVE}
                        </Button>
                        <Button mode="contained" onPress={onCancel} style={recipeEditStyles.button}>
                            {CANCEL}
                        </Button>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};