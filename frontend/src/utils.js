export function getFullYear() {
    const currentYear = new Date();
    return currentYear.getFullYear();
};

export function getFooterCopy(isIndex) {
    const condition = isIndex;
    if (condition) {
        return "ALX";
    }else {
        return "ALX main dashboard";
    }
};

export function getLatestNotification() {
    return "<strong>Urgent requirement</strong> - complete by EOD"
};