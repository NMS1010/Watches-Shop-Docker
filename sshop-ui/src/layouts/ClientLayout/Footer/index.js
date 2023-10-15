import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
    return (
        <footer className="bg-gray-100">
            <div className="mx-auto max-w-screen-xl pt-16 pb-4 xl:px-20 lg:px-12 sm:px-6 px-4 text-3xl">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 md:gap-8 gap-4">
                    <div className="flex flex-col flex-shrink-0">
                        <div className="dark:text-white">
                            <a href="/" className="flex items-center lg:order-0">
                                <img
                                    src="https://flowbite.com/docs/images/logo.svg"
                                    className="mr-3 h-6 sm:h-9 w-30"
                                    alt="SShop Logo"
                                />
                                <span className="self-center text-5xl font-semibold whitespace-nowrap dark:text-white">
                                    SShop
                                </span>
                            </a>
                        </div>
                        <p className="leading-none text-gray-400 font-thin mt-4 dark:text-white">
                            SShop company, we provide eCommerce for everyone. Get started for free.
                        </p>
                        <div className="flex mt-7">
                            <FontAwesomeIcon className="cursor-pointer text-4xl mr-2" icon={faFacebook} />
                            <FontAwesomeIcon className="ml-2 cursor-pointer text-4xl" icon={faTwitter} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-semibold leading-4 text-gray-600 dark:text-white">Địa chỉ văn phòng</h2>

                        <p className="text-2xl leading-none text-gray-400 font-thin mt-4 dark:text-white">
                            To Ngoc Van, Linh Dong, Thu Duc, Ho Chi Minh
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-semibold leading-4 text-gray-600 dark:text-white">Thông tin liên hệ</h2>

                        <p className="text-2xl leading-none text-gray-400 font-thin mt-4 dark:text-white">
                            Nguyen Minh Son
                        </p>
                        <p className="text-2xl leading-none text-gray-400 font-thin mt-4 dark:text-white">
                            Email: nguyenminhson102002@gmail.com
                        </p>
                        <p className="text-2xl leading-none text-gray-400 font-thin mt-4 dark:text-white">
                            Phone: 0354964840
                        </p>
                    </div>
                </div>
                <div className="border-t-2 mt-24 border-gray-300 ">
                    <p className="leading-none text-2xl mb-0 text-gray-800 mt-4 dark:text-white">
                        Copyright © 2023 SShop. All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
