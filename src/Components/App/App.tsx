import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import merge from 'deepmerge';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme, PaperProvider } from 'react-native-paper';
import { en, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ServicesProvider } from '../../Providers/servicesProvider';
import { ParentStackNavigator } from '../Navigation/parentStackNavigator';
import { ToastProvider } from 'react-native-paper-toast';

registerTranslation('en', en);

export default function App() {
    const CombinedDefaultTheme = merge(NavigationDefaultTheme, PaperDefaultTheme);
    const CombinedDarkTheme = merge(NavigationDarkTheme, PaperDarkTheme);

    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme}>
                    <ToastProvider>
                        <ServicesProvider>
                            <ParentStackNavigator />
                        </ServicesProvider>
                    </ToastProvider>
                </NavigationContainer>
            </PaperProvider>
        </SafeAreaProvider>
    );
};