import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../redux/features/auth/authSlice';
import config from '../../configs';
import { Navigate } from 'react-router-dom';
import * as authUtils from '../../utils/authUtils';
import * as authAction from '../../redux/features/auth/authSlice';
const PrivateRoute = ({ children, roles }) => {
    const dispatch = useDispatch();
    let { currentUser } = useSelector((state) => state?.auth);

    if (!authUtils.isTokenStoraged()) {
        dispatch(authAction.logout());
        return <Navigate to={config.routes.auth} replace />;
    }
    if (!currentUser) {
        dispatch(getCurrentUser());
        return;
    }
    if (roles.includes('admin') && !roles.includes('customer')) {
        const res = currentUser.roles.some((role) => role?.roleName === 'Admin');
        if (!res) {
            return <Navigate to={config.routes.forbidden} replace />;
        }
    }
    return children;
};

export default PrivateRoute;
