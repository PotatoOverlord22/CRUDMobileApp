import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { useServices } from "../../Providers/servicesProvider";
import { CustomResponse } from "../../Models/CustomResponse";
import { Recipe } from "../../Models/Recipe";
import { recipesStyles } from "../RecipesList/recipesList.styles";

export const Insights: React.FC = (): JSX.Element => {
    const services = useServices();
    const toaster = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [topCategories, setTopCategories] = useState<{ category: string; totalRating: number }[]>([]);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response: CustomResponse<Recipe[]> = await services.RecipeService.GetAll();
            const categoryRatings: Record<string, number> = {};

            response.data.forEach((recipe) => {
                categoryRatings[recipe.category] = (categoryRatings[recipe.category] || 0) + recipe.rating;
            });

            const sortedCategories = Object.entries(categoryRatings)
                .map(([category, totalRating]) => ({ category, totalRating }))
                .sort((a, b) => b.totalRating - a.totalRating)
                .slice(0, 3);

            setTopCategories(sortedCategories);
        } catch (error) {
            toaster.show({ message: "Error fetching insights", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={recipesStyles.mainContainer}>
            {isLoading ? (
                <View style={recipesStyles.activityIndicatorContainer}>
                    <ActivityIndicator animating size="large" />
                </View>
            ) : (
                <ScrollView>
                    <Text variant="headlineMedium">
                        Top 3 Categories by Rating
                    </Text>
                    {topCategories.map(({ category, totalRating }, index) => (
                        <List.Item
                            key={index}
                            title={category}
                            description={`Total Rating: ${totalRating}`}
                            left={(props) => <List.Icon {...props} icon="star" />}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
