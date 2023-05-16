const logoutHandler = async (dispatch, navigate, messageAction, authAction) => {
    // dispatch(
    //     messageAction.setMessage({
    //         id: Math.random(),
    //         title: 'Login',
    //         message: 'Token has expired, please login to continue',
    //         backgroundColor: '#d9534f',
    //         icon: '',
    //     }),
    // );
    dispatch(authAction.logout());
    navigate('/auth');
};
export default logoutHandler;
