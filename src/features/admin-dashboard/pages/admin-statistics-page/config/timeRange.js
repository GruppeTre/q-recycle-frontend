export const timeRange = {
    LAST_MONTH: {
        label: "Last month",
        getDate: () => {
            return new Date();
        }
    },

    ALL_TIME: {
        label: "All time",
        getDate: () => {
            return new Date();
        }
    }
}