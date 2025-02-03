import { Text, View } from "react-native";
import { RecipesDetailsNavigationProps } from "../../Library/routeParams";
import { SafeAreaView } from "react-native-safe-area-context";

export const RecipeDetails: React.FC<RecipesDetailsNavigationProps> = ({ route }: RecipesDetailsNavigationProps): JSX.Element => {
    console.log(route.params.recipe);

    return (
        <SafeAreaView>
            <Text>Recipe Details</Text>
        </SafeAreaView>
    );
};