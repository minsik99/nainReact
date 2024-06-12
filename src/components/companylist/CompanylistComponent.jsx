import axios from "axios";
import React, { useRef, useEffect, useState } from 'react';
import { useMutation } from "react-query";

const CompanylistComponent = () => {
    const [keyword, setKeyword] = useState('');
    const searchOn = useRef(null);

    const mutation = useMutation(newKeyword => {
        return axios.post("http://127.0.0.1:8080/companylistsearch", { keyword: newKeyword });
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate(keyword);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={keyword} 
                    onChange={(e) => setKeyword(e.target.value)} 
                    ref={searchOn} 
                />
                <button type="submit">Search</button>
            </form>
            
            {mutation.isLoading && <p>Loading...</p>}
            {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
            {mutation.isSuccess && mutation.data && mutation.data.data && (
                <div>
                    <h3>Results:</h3>
                    <ul>
                        {mutation.data.data.map((article, index) => (
                            <li key={index}>
                                <h4>{article.company}</h4>
                                <h4>{article.title}</h4>
                                <p>{article.link}</p>
                                <p>{article.require}</p>
                                <p>{article.time}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CompanylistComponent;
