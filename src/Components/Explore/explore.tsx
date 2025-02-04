import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { CustomResponse } from "../../Models/CustomResponse";
import { Recipe } from "../../Models/Recipe";
import { useServices } from "../../Providers/servicesProvider";
import { recipesStyles } from "../RecipesList/recipesList.styles";

const groupByMonth = (recipes: Recipe[]) => {
    const monthlyRatings: Record<string, { total: number; count: number }> = {};

    recipes.forEach(({ date, rating }) => {
        const month = (date as unknown as string).slice(0, 7);
        if (!monthlyRatings[month]) {
            monthlyRatings[month] = { total: 0, count: 0 };
        }
        monthlyRatings[month].total += rating;
        monthlyRatings[month].count += 1;
    });

    return Object.entries(monthlyRatings)
        .map(([month, { total, count }]) => ({ month, avgRating: total / count }))
        .sort((a, b) => b.avgRating - a.avgRating); // Sort by highest average rating
};

export const Explore: React.FC = (): JSX.Element => {
    const services = useServices();
    const [monthlyAnalysis, setMonthlyAnalysis] = useState<{ month: string; avgRating: number }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            setIsLoading(true);
            try {
                const serviceResponse: CustomResponse<Recipe[]> = await services.RecipeService.GetAll();
                setMonthlyAnalysis(groupByMonth(serviceResponse.data));
            } catch (error) {
                console.log("Failed to fetch recipes", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <View style={recipesStyles.mainContainer}>
            {isLoading ? (
                <View style={recipesStyles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true} size="large" />
                </View>
            ) : (
                <ScrollView>
                    <Text variant="headlineMedium">
                        Monthly rating analysis
                    </Text>
                    {monthlyAnalysis.map(({ month, avgRating }) => (
                        <List.Item
                            key={month}
                            title={`Month: ${month}`}
                            description={`Average Rating: ${avgRating.toFixed(2)}`}
                            left={() => <List.Icon icon="star" />}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
