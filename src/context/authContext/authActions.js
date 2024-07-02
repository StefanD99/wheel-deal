import {EmailAuthProvider, createUserWithEmailAndPassword, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {Timestamp, doc, setDoc} from 'firebase/firestore';
import {auth, db } from '../../fbConfig';

export const registerUser = async (formData) => {
    const {email, password, firstName, lastName, userName} = formData;
    
    try {
       const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            firstName,
            lastName,
            userName,
            email,
            createdAt: Timestamp.fromDate(new Date())
        });
        return result.user;
    } catch (error) {
        console.log(error);
        return null;
    }
};

//! async method za singing user out

export const logoutUser = async () => {
    // const currentUser = auth.currentUser; // ! Objekat koji cuva trenutno ulogovanog korisnika!
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.log(error);
    }
};

export const sendForgotPasswordEmail = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        console.log(error);
    }
};


// export const loginUser = async (email, password) => {
//     try {
//         await signInWithEmailAndPassword(auth, email, password);
//         return true;
//     } catch (error) {
//         console.log(error);
//     }
// };
export const loginUser = async (formData) => {
    const {email, password} = formData;
    try {
        const result =  await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.log(error);
    }
};

export const reauthenticateUser = async (currentUser, password) => {
    const credentials = EmailAuthProvider.credential(currentUser.email, password);
    try {
        return reauthenticateWithCredential(currentUser, credentials);
    } catch (error) {
        console.log(error);
    }
};