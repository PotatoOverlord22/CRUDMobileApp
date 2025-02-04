import { ToastOptions } from "react-native-paper-toast";
import { getErrorNotificationOptions } from "./Utils/toastUtils";

export const NO_INTERNET_MESSAGE: string = "No internet connection. Please check your network.";
export const RETRY: string = "Retry";
export const IP_ADDRESS: string = "192.168.1.140";
export const PORT: number = 2528;
export const DATABASE_NAME: string = "recipes.db";

export const usingCachedDataNotification: ToastOptions = getErrorNotificationOptions("No internet connection, showing cached data.");