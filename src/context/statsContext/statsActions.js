import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../fbConfig";
import { convertPriceStringToNumber } from "../../utils/priceUtils";

export const subscribeToStatsForUser = (onAdsReceived) => {
    const userId = auth.currentUser.uid;
    const q = query(collection(db, 'stats'), where('soldBy', '==', userId));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const soldAds = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        const soldAdsEarnings = soldAds.reduce((prevVal, nexAd) => {
            return prevVal + convertPriceStringToNumber(nexAd.ad.price)
        }, 0);
        onAdsReceived(soldAds, soldAdsEarnings);
    }, (error) => {
        console.log(error);
    });
    return unsubscribe;
};