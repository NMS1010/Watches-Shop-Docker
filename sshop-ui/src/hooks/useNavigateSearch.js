import { createSearchParams, useNavigate } from 'react-router-dom';

const useNavigateSearch = () => {
    const navigate = useNavigate();

    return (path, params) => navigate(`${path}?${createSearchParams(params)}`);
};

export default useNavigateSearch;
