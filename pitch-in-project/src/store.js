import {createStore} from "redux";
import loggedData from "./reducers/loggedData";

function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state", serializedState);
    }
    catch (err) {
        console.log(err)
    }
}

function loadState(){
    try{
        const serializedState = localStorage.getItem("state");
        if(serializedState === null){
            return undefined;
        }
        return JSON.parse(serializedState)
    }catch(err){
        console.log(err);
        return undefined;
    }
}


const persistedState = loadState();

const store = createStore(loggedData, persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

store.subscribe(() => saveState(store.getState()));


export default store;