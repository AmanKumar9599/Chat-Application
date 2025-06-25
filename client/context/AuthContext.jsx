import { useState, useEffect, createContext } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // ✅ check if user is authenticated
    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/api/auth/check'); // no need to pass headers manually if default is set
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    // ✅ login function
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);

                // ✅ correct token header
                const authHeader = `Bearer ${data.token}`;
                axios.defaults.headers.common["Authorization"] = authHeader;

                setToken(data.token);
                localStorage.setItem("token", data.token);

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    // ✅ logout
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common["Authorization"];
        toast.success("Logged out successfully");
        socket?.disconnect();
    };

    // ✅ update profile
    const updateProfile = async (body) => {
        try {
          const { data } = await axios.put("/api/auth/update-profile", body);
          if (data.success) {
            setAuthUser(data.user); // 🔁 update context
            localStorage.setItem("chat-user", JSON.stringify(data.user)); // 💾 update localStorage
            toast.success("Profile updated successfully");
            navigate("/"); 
          }
        } catch (err) {
          toast.error(err.response?.data?.message || err.message);
        }
      };
      

    // ✅ socket connect
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            },
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };


   

    // ✅ useEffect: auto-auth
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            checkAuth();
        }
    }, [token]);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
