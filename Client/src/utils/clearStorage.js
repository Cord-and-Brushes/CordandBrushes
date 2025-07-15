// Utility function to clear Redux persist storage
export const clearReduxStorage = () => {
  try {
    // Clear the main persist key
    localStorage.removeItem("persist:root");

    // Also clear any other potential persist keys
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("persist:")) {
        localStorage.removeItem(key);
      }
    });

    console.log("Redux persist storage cleared successfully");
    return true;
  } catch (error) {
    console.error("Error clearing Redux storage:", error);
    return false;
  }
};

// Function to check if storage needs clearing
export const checkAndClearStorage = () => {
  try {
    const persistedState = localStorage.getItem("persist:root");
    if (persistedState) {
      const parsedState = JSON.parse(persistedState);
      // Check if the state contains unexpected keys
      if (parsedState.banner || parsedState.posts) {
        console.log(
          "Detected old persisted state with unexpected keys, clearing..."
        );
        clearReduxStorage();
        return true;
      }
    }
  } catch (error) {
    console.error("Error checking persisted state:", error);
    clearReduxStorage();
    return true;
  }
  return false;
};
