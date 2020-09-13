export const Add = (username, token) => {
    return{
        type: "ADD",
        payload : {
            username: username,
            token: token
        }
    }
}

export const Delete = () => {
    return{
        type: "DELETE"
    }
}