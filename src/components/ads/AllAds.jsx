import { useContext, useEffect, useState } from "react";
import AdContext from "../../context/adContext/AdContext";
import { getAdsForUser, getAllAds, subscribeToAdsForUser, subscribeToAllAds } from "../../context/adContext/adActions";
import ActionTypes from "../../context/adContext/adActionTypes";
import NoDataMsg from "../shared/NoDataMsg";
import AdCard from "./AdCard";
import { auth } from "../../fbConfig";
import CustomSpinner from "../shared/Spinner";


function AllAds({fetchUserAds, userId}) {

    const [adsList, setAdslist] = useState([]);
    const {allAds, adsForUser, dispatch, adsFilter} = useContext(AdContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        let unsubscribe;
        if (fetchUserAds) {
            unsubscribe = subscribeToAdsForUser(userId, adsFilter, (fetchedAds) => {
                dispatch({
                    type: ActionTypes.SET_ADS_FOR_USER,
                    payload: fetchedAds
                });
                setAdslist(fetchedAds);
                setIsLoading(false);
            });
        } else {
            unsubscribe = subscribeToAllAds(adsFilter, (fetchedAds) => {
                dispatch({
                    type: ActionTypes.SET_ALL_ADS,
                    payload: fetchedAds
                });
                setAdslist(fetchedAds);
                setIsLoading(false);
          });
        };
        return () => unsubscribe;
        


        // async function fetchData() {
        //     let fetchedAds;
        //     if (fetchUserAds) {
        //         const isLoggedUserAds = adsForUser?.some(ad => ad.createdBy === userId);
        //         fetchedAds = isLoggedUserAds ? adsForUser : await getAdsForUser(userId);
        //         if (!adsForUser.length) {
        //             dispatch({
        //                 type: ActionTypes.SET_ADS_FOR_USER,
        //                 payload: fetchedAds
        //               });
        //         }
        //     } else {
        //         fetchedAds = allAds?.length ? allAds : await getAllAds();
        //         if (!allAds.length) {
        //               dispatch({
        //                 type: ActionTypes.SET_ALL_ADS,
        //                 payload: fetchedAds
        //               });
        //         } 
        //     }
        //     setAdslist(fetchedAds);
        // };
        // fetchData();
    }, [userId, adsFilter, dispatch]);

    if (isLoading) {
        return <CustomSpinner />
    }

    if (!adsList?.length) {
        return <NoDataMsg messageText='No Data found...' />
    }

    return (
        <div>
            <div className="custom-cards-wrapper">
            {
                adsList.map(ad => (
                <AdCard 
                    key={ad.id}
                    cardData={ad} 
                    isEditEnabled={fetchUserAds && userId === auth.currentUser.uid} />
            ))
            }
            </div>
        </div>
    )
};

export default AllAds;
