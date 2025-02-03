import { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RecipeEditNavigationProps } from "../../Library/routeParams";
import { Recipe } from "../../Models/Recipe";
import { CANCEL, CREATE_RECIPE, EDIT_RECIPE, getRecipeEditStyles, SAVE } from "./recipeEdit.styles";
import React from "react";

const defaultRecipe: Recipe = {
    id: -1,
    title: "",
    ingredients: [],
    category: "",
    creationDate: new Date(),
    rating: 0
};

export const RecipeEdit: React.FC<RecipeEditNavigationProps> = (props: RecipeEditNavigationProps): JSX.Element => {
    const [recipe, setRecipe] = useState<Recipe>(props.route.params.recipe ?? defaultRecipe);
    const isEditing: boolean = props.route.params.isEditing;
    const insets = useSafeAreaInsets();
    const recipeEditStyles = getRecipeEditStyles(insets);

    const onInputChange = (field: keyof Recipe, value: string | string[] | number | Date) => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            [field]: value,
        }));
    };

    const onSave = (): void => {

    };

    const onCancel = (): void => {
        props.navigation.goBack();
    };

    return (
        <SafeAreaView style={recipeEditStyles.container}>
            <ScrollView>
                <Text variant="headlineLarge" style={recipeEditStyles.input}>
                    {isEditing ? EDIT_RECIPE : CREATE_RECIPE}
                </Text>
                <TextInput
                    label={isEditing ? EDIT_RECIPE : CREATE_RECIPE}
                    value={recipe.title}
                    onChangeText={(text) => onInputChange("title", text)}
                    style={recipeEditStyles.input}
                />
                <TextInput
                    label="Category"
                    value={recipe.category}
                    onChangeText={(text) => onInputChange("category", text)}
                    style={recipeEditStyles.input}
                />
                <TextInput
                    label="Ingredients (comma separated)"
                    value={recipe.ingredients?.join(", ") ?? ""}
                    onChangeText={(text) => onInputChange("ingredients", text.split(", "))}
                    style={recipeEditStyles.input}
                />
                <TextInput
                    label="Rating"
                    value={recipe.rating ? recipe.rating.toString() : ""}
                    keyboardType="numeric"
                    onChangeText={(text) => onInputChange("rating", parseFloat(text))}
                    style={recipeEditStyles.input}
                />
                <DatePickerInput
                    label="Creation Date"
                    locale="en"
                    value={recipe.creationDate}
                    onChange={(date: CalendarDate): void => onInputChange("creationDate", date ?? new Date())}
                    inputMode="start"
                />

                <View style={recipeEditStyles.buttonContainer}>
                    <Button mode="contained" onPress={onSave} style={recipeEditStyles.button}>
                        {SAVE}
                    </Button>
                    <Button mode="contained" onPress={onCancel} style={recipeEditStyles.button}>
                        {CANCEL}
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};