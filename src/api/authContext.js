import React, { createContext, useState, useEffect } from 'react';
import instance from './axiosApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [member, setMember] = useState(null);
    const [memberNo, setMemberNo] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const memberData = async () => {
            const token = window.localStorage.getItem("token");
            if (token) {
                try {
                    const response = await instance.get('/api/auth/member/mypage', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMember(response.data);
                    setMemberNo(response.data.memberNo)
                    console.debug(response.data.memberNo)
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                    setMember(null);
                }
            }
            setLoading(false);
        };

        memberData();
    }, []);

    return (
        <AuthContext.Provider value={{ member, memberNo, setMember, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
