import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";



export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`
})


export const AuthProvider = ({ children }) => {

    const [userData, setUserData] = useState({});

    const router = useNavigate();

    const handleRegister = useCallback(async (name, username, email, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                email: email,
                password: password
            })


            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }, []);

    const handleLogin = useCallback(async (email, password) => {
        try {
            let request = await client.post("/login", {
                email: email,
                password: password
            });

            console.log(email, password)
            console.log(request.data)

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }, [router]);

    const getHistoryOfUser = useCallback(async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch (err) {
            throw err;
        }
    }, []);

    const addToUserHistory = useCallback(async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }, []);


    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

};
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
