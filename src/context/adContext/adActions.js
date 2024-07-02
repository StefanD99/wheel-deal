import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../fbConfig";
import { fetchUser } from "../profileContext/profileActions";

export const createAd = async (adData) => {
    const {title, vType, description, price, location, contact, imgs} = adData;
    try {
        await addDoc(collection(db, 'ads'), {
            title,
            type: vType.toLowerCase(),
            description,
            contact,
            location,
            price,
            isSold: false,
            publishedAt: Timestamp.fromDate(new Date()),
            images: imgs,
            createdBy: auth.currentUser.uid
        });
        return true;
    } catch (error) {
        console.log(error);
    }
};

// export const getAllAds = async () => {
//     const q = query(
//         collection(db, 'ads'),
//         where('isSold', '==', false)
//     ); // ! build-ujemo firestore query koji ce iz ads kolekcije dobaviti samo one ad-ove koji nisu prodati

//     try {
//         const querySnapshot = await getDocs(q);
//         const unsoldAds = querySnapshot.docs
//             .map(doc => ({id: doc.id, ...doc.data()}));
//         return unsoldAds;
//     } catch (error) {
//         console.log(error);
//     }
// };

export const subscribeToAllAds = (adsFilter, onAdsReceived) => {
    let q = query(
        collection(db, 'ads'),
        where('isSold', '==', false)
    );

    if (adsFilter) {
        Object.keys(adsFilter).forEach(filterKey => {
            q = filterKey === 'publishedAt'
                ? query(q, where(filterKey, '>=', adsFilter[filterKey]))
                : query(q, where(filterKey, '==', adsFilter[filterKey]))
        });
    }

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const unsoldAds = querySnapshot.docs
            .map(doc => ({id: doc.id, ...doc.data()}));
            const creatorsIds = [...new Set(unsoldAds.map(ad => ad.createdBy))]; // niz unikatnih ID-eva kreatora svih ogalsa
        const userPromises = creatorsIds.map(fetchUser);
        const users = await Promise.all(userPromises);
        const usersById = users.reduce((acc, user) => {
            acc[user.uid] = user; 
            return acc;
        }, {});
        const allAdsWithCreatorDetails = unsoldAds.map(ad => ({
            ...ad,
            user: usersById[ad.createdBy]
        }));
        onAdsReceived(allAdsWithCreatorDetails);
        }, (error) => {
            console.log(error);
        });
        return unsubscribe;
    }

// export const getAdsForUser = async (userId) => {
//     const q = query(
//         collection(db, 'ads'),
//         where('createdBy', '==', userId)
//     );

//     try {
//         const querySnapshot = await getDocs(q);
//         const adsForUser = querySnapshot.docs
//             .map(doc => ({id: doc.id, ...doc.data()}));
//         return adsForUser;
//     } catch (error) {
//         console.log(error);
//     }
// };

export const subscribeToAdsForUser = (userId, adsFilter, onAdsReceived) => {
    let q = query(
                collection(db, 'ads'),
                where('createdBy', '==', userId)
            );

            if (adsFilter) {
                Object.keys(adsFilter).forEach(filterKey => {
                    q = filterKey === 'publishedAt'
                        ? query(q, where(filterKey, '>=', adsFilter[filterKey]))
                        : query(q, where(filterKey, '==', adsFilter[filterKey]))
                });
            }
        
            const unsubscribe = onSnapshot(q, async (querySnapshot) => {

            const adsForUser = querySnapshot.docs
            .map(doc => ({id: doc.id, ...doc.data()}));
            const creatorsIds = [...new Set(adsForUser.map(ad => ad.createdBy))]; // niz unikatnih ID-eva kreatora svih ogalsa
        const userPromises = creatorsIds.map(fetchUser);
        const users = await Promise.all(userPromises);
        const usersById = users.reduce((acc, user) => {
            acc[user.uid] = user; 
            return acc;
        }, {});
        const allAdsWithCreatorDetails = adsForUser.map(ad => ({
            ...ad,
            user: usersById[ad.createdBy]
        }));
        onAdsReceived(allAdsWithCreatorDetails);
        }, (error) => {
            console.log(error);
        });
        return unsubscribe;
};

export const updateAd = async (adId, adData) => {
    const {title, vType, description, price, location, contact, imgs} = adData;
    const adRef = doc(db, 'ads', adId);

    const updateData = {
        title,
        type: vType.toLowerCase(),
        description,
        contact,
        price,
        location
    }

    if (imgs?.length) {
        updateData.images = imgs;
    }

    try {
        await updateDoc(adRef, updateData);
        return true;
    } catch (error) {
        console.log(error);
    }
};

export const updateAsSold = async (adData) => {
    const {id} = adData;
    const adRef = doc(db, 'ads', id);
    try {
        await updateDoc(adRef, {
            isSold: true
        });
        await addDoc(collection(db, 'stats'), {
            ad: adData,
            soldBy: auth.currentUser.uid,
            soldTimestamp: Timestamp.fromDate(new Date())
        });
        return true;
    } catch (error) {
        console.log(error);
    }
};

export const deleteAdById = async (adId) => {
    const adRef = doc(db, 'ads', adId);
    try {
        await deleteDoc(adRef);
    } catch (error) {
        console.log();
    }
};