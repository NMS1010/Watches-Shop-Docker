const Forbidden = () => {
    return (
        <div className="w-full text-center h-screen relative bg-black">
            <div className="my-auto absolute top-1/2 left-1/2 -translate-y-2/4 -translate-x-2/4">
                <h1 className="">
                    <code className="text-7xl">Access Denied</code>
                </h1>
                <hr className="my-5 w-1/2 m-auto text-white"></hr>
                <h3 className=" text-3xl text-white">You dont have permission to view this site.</h3>
                <h3 className="my-5 text-3xl">🚫🚫🚫🚫</h3>
                <h6 className=" text-3xl text-white">Error code: 403 FORBIDDEN</h6>
            </div>
        </div>
    );
};

export default Forbidden;
