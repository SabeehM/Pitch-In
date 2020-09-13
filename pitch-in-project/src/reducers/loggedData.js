const initialState={
    username: "",
    token: ""
  }

const modifyUser = (state = initialState, action) => {
    switch(action.type){
      case "ADD":
        return {...state, username: action.payload.username, token: action.payload.token};
      case "DELETE":
        return {initialState};
      default:
        return state;
    }
  }

export default modifyUser;