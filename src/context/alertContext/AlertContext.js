import { createContext, useReducer } from "react";
import { Toast, ToastBody } from "react-bootstrap";
import alertReducer from "./AlertReducer";

const initState = {
    message: '',
    variant: '',
    isAlert: false //! Da li je prikazan ili sakriven
}

const AlertContext = createContext(initState);

export const AlertProvider = ({children}) => {
    const [state, dispatch] = useReducer(alertReducer, initState);

    const showAlert = (message, variant='success') => {
        dispatch({
            type: 'SHOW_ALERT',
            payload: {
                message,
                variant
            }
        });
    }

    return (
        <AlertContext.Provider value={{
            ...state,
            showAlert
        }}>
            {children}
            <Toast 
                onClose={() => dispatch({type: 'HIDE_ALERT'})} 
                show={state.isAlert} delay={3000} 
                autohide 
                bg={state.variant} 
                style={{
                    position: 'fixed', 
                    top: 20,
                     right: 20
                     }}>
                <ToastBody>{state.message}</ToastBody>
            </Toast>
        </AlertContext.Provider>
    )
}

export default AlertContext;
