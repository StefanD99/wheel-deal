import ActionTypes from "./authActionTypes";

// ! Reducer je mehanizam React-a koji prima informaciju o trenutnom stanju (initState) i ono sto treba da se promeni, na osnovu toga vratimo neko azurirano stanje! 
// ! Definisemo akcije koje mogu uticati na state i sta ce se desiti kada se te akcije okinu i taj state se vraca nazad! 
// ! Preko dispatch-a se taj state menja i dobija novo stanje nase aplikacije!
const authReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true
            }
            case ActionTypes.REGISTER_ERROR:
                return {
                    ...state,
                    user: {},
                    isAuthenticated: false
                }
            case ActionTypes.LOGOUT_SUCCESS:
                return {
                    ...state,
                    user: {},
                    isAuthenticated: false,
                    checkingStatus: false
                }
            case ActionTypes.LOGOUT_ERROR:
                return {
                    ...state,
                    checkingStatus: false
                }
                case ActionTypes.LOGIN_SUCCESS:
                    return {
                        ...state,
                        user: action.payload,
                        isAuthenticated: true,
                        checkingStatus: false
                    }
                case ActionTypes.LOGIN_ERROR:
                    return {
                        ...state,
                        user: {},
                        isAuthenticated: false
                    }
        default:
            return state;
    }
};

export default authReducer;