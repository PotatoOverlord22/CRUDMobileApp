import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";

export const CREATE_RECIPE: string = "Create Recipe";
export const EDIT_RECIPE: string = "Edit Recipe";
export const SELECT_DATE: string = "Select creation date";
export const SAVE: string = "Save";
export const CANCEL: string = "Cancel";

export const getRecipeEditStyles = (insets: EdgeInsets) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Math.max(insets.top, 15),
        paddingLeft: Math.max(insets.left, 15),
        paddingRight: Math.max(insets.right, 15),
        paddingBottom: insets.bottom,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 20,
        width: "40%",
    },
});