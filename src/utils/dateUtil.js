export const convertFBTimestampToDate = (timestamp) => {
    const toDate = new Date(timestamp.seconds * 1000);
    const formatedDate = toDate.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }); // 11.04.2024
    return formatedDate + '.'; // 11.04.2024.
};