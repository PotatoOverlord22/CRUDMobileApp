import { StyleSheet } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export const LIST_BUTTON_SIZE: number = 30;
export const LIST_ITEM_ICON: IconSource = "food";
export const CREATE_ICON: IconSource = "plus";
export const EDIT_ICON: IconSource = "pencil";
export const DELETE_ICON: IconSource = "delete";
export const FETCH_RECIPES_ERROR_MESSAGE: string = "Failed to fetch recipes";
export const FETCH_RECIPES_SUCCESS_MESSAGE: string = "Successfully fetched recipes";

export const recipesStyles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    iconButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
    activityIndicatorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});