import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { InternalRoutes } from '../../Library/Enums/InternalRoutes';
import { Insights } from '../Insights/insightsScreen';
import { RecipesList } from '../RecipesList/recipesList';

const Tab = createMaterialBottomTabNavigator();

export const TabNavigator: React.FC = (): JSX.Element => {
    const insets: EdgeInsets = useSafeAreaInsets();

    return (
        <Tab.Navigator style={{ paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right, paddingBottom: insets.bottom, flex: 1 }} >
            <Tab.Screen
                name={InternalRoutes.Recipes}
                component={RecipesList}
                options={{
                    title: InternalRoutes.Recipes,
                    tabBarIcon: "food",
                }}
            />
            <Tab.Screen
                name={InternalRoutes.Insights}
                component={Insights}
                tabBarVisible={false}
                options={{
                    title: InternalRoutes.Insights,
                    tabBarIcon: "chart-bar",
                }}
            />
        </Tab.Navigator>
    );
};