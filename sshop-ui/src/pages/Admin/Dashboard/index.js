import { faBagShopping, faMoneyBill, faUser } from '@fortawesome/free-solid-svg-icons';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import YearPicker from 'react-year-picker';
import DatePicker from 'react-datepicker';
import * as statisticsAPI from '../../../services/statisticsAPI';
import * as messageAction from '../../../redux/features/message/messageSlice';
import messages from '../../../configs/messages';
import Loading from '../../../components/Loading';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BACKGROUND_COLOR_FAILED } from '../../../constants';
let colorPalette = ['#00D8B6', '#008FFB', '#FEB019', '#FF4560', '#775DD0'];
const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [chartOneOpts, setChartOneOpts] = useState({
        series: [
            {
                name: 'Monthly Revenue',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'left',
        },
        colors: ['#3C50E0'],
        chart: {
            fontFamily: 'Satoshi, sans-serif',
            height: 335,
            type: 'area',
            dropShadow: {
                enabled: true,
                color: '#623CEA14',
                top: 10,
                blur: 4,
                left: 0,
                opacity: 0.1,
            },

            toolbar: {
                show: false,
            },
        },
        responsive: [
            {
                breakpoint: 1024,
                options: {
                    chart: {
                        height: 300,
                    },
                },
            },
            {
                breakpoint: 1366,
                options: {
                    chart: {
                        height: 350,
                    },
                },
            },
        ],
        stroke: {
            width: [2, 2],
            curve: 'straight',
        },

        markers: {
            size: 0,
        },
        labels: {
            show: false,
            position: 'top',
        },
        grid: {
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 4,
            colors: '#fff',
            strokeColors: ['#3056D3'],
            strokeWidth: 3,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            hover: {
                size: undefined,
                sizeOffset: 5,
            },
        },
        xaxis: {
            type: 'category',
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            title: {
                style: {
                    fontSize: '0px',
                },
            },
            min: 0,
            max: 1000000,
        },
    });
    const [chartTwoOpts, setChartTwoOpts] = useState({
        series: [
            {
                name: 'Weekly Revenue',
                data: [0, 0, 0, 0, 0, 0, 0],
            },
        ],
        colors: ['#3056D3'],
        chart: {
            type: 'bar',
            height: 335,
            stacked: true,
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: true,
            },
        },

        responsive: [
            {
                breakpoint: 1536,
                options: {
                    plotOptions: {
                        bar: {
                            borderRadius: 0,
                            columnWidth: '25%',
                        },
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 0,
                columnWidth: '25%',
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
            },
        },
        dataLabels: {
            enabled: false,
        },

        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            fontFamily: 'Satoshi',
            fontWeight: 500,
            fontSize: '14px',

            markers: {
                radius: 99,
            },
        },
        fill: {
            opacity: 1,
        },
    });
    const [chartThreeOpts, setChartThreeOpts] = useState({
        chart: {
            type: 'donut',
            width: '100%',
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                customScale: 0.8,
                donut: {
                    size: '75%',
                },
                offsetY: 20,
            },
            stroke: {
                colors: undefined,
            },
        },
        colors: colorPalette,
        title: {
            text: 'Order status',
            style: {
                fontSize: '18px',
            },
        },
        series: [21, 23, 19, 14, 6],
        labels: ['Pending', 'Ready to ship', 'On the way', 'Delivered', 'Cancelled'],
        legend: {
            position: 'left',
            offsetY: 80,
        },
    });
    const [chosenDate, setChosenDate] = useState(new Date());
    const [chosenYear, setChosenYear] = useState(2023);
    const [statistics, setStatistics] = useState(null);

    const dispatch = useDispatch();

    const fetchStatistic = useCallback(async () => {
        setLoading(true);
        const resp = await statisticsAPI.getStatistic();
        if (!resp?.isSuccess) {
            setLoading(true);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Statistic',
                    message: resp?.errors || messages.admin.statistic.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            let stat = resp.data;
            let replace = { ...chartThreeOpts };
            replace.series = [
                stat.totalPending,
                stat.totalReady,
                stat.totalDelivering,
                stat.totalCompleted,
                stat.totalCanceled,
            ];
            setStatistics(stat);
            setChartThreeOpts(replace);
            setLoading(false);
        }
    }, []);
    const fetchChartOne = useCallback(async () => {
        setLoading(true);
        const resp = await statisticsAPI.getYearlyRevenue(chosenYear);
        if (!resp?.isSuccess) {
            setLoading(true);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Statistic',
                    message: resp?.errors || messages.admin.statistic.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            let dt = resp.data;
            let clone = Object.assign({}, chartOneOpts);
            clone.series[0].data = [
                dt.janTotal,
                dt.febTotal,
                dt.marTotal,
                dt.aprTotal,
                dt.mayTotal,
                dt.junTotal,
                dt.julTotal,
                dt.augTotal,
                dt.sepTotal,
                dt.octTotal,
                dt.novTotal,
                dt.decTotal,
            ];
            clone.yaxis.max = Math.max(...clone.series[0].data) + 100000;
            setChartOneOpts(clone);
            setLoading(false);
        }
    }, [chosenYear]);
    const fetchChartTwo = useCallback(async () => {
        setLoading(true);
        const resp = await statisticsAPI.getWeeklyRevenue(
            chosenDate.getFullYear(),
            chosenDate.getMonth() + 1,
            chosenDate.getDate(),
        );
        if (!resp?.isSuccess) {
            setLoading(true);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Statistic',
                    message: resp?.errors || messages.admin.statistic.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            let dt = resp.data;
            let replace = Object.assign({}, chartTwoOpts);
            replace.series[0].data = [
                dt.monTotal,
                dt.tueTotal,
                dt.wedTotal,
                dt.thurTotal,
                dt.friTotal,
                dt.satTotal,
                dt.sunTotal,
            ];
            setChartTwoOpts(replace);
            setLoading(false);
        }
    }, [chosenDate]);

    useEffect(() => {
        fetchStatistic();
    }, []);

    useEffect(() => {
        fetchChartOne();
    }, [chosenYear]);

    useEffect(() => {
        fetchChartTwo();
    }, [chosenDate]);

    const handleChange = (date) => {
        setChosenDate(date);
    };
    const handleChangeYear = (year) => {
        setChosenYear(year);
    };
    return loading ? (
        <Loading />
    ) : (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-8">
                <div className="rounded-sm border border-stroke bg-white py-10 px-8 shadow-lg dark:border-strokedark dark:bg-boxdark">
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <h4 className="text-4xl font-bold text-black dark:text-white">{statistics?.totalOrders}</h4>
                            <span className="text-2xl">Total orders</span>
                        </div>
                        <FontAwesomeIcon icon={faBagShopping} className="text-6xl" />
                    </div>
                </div>
                <div className="rounded-sm border border-stroke bg-white  py-10 px-8 shadow-lg dark:border-strokedark dark:bg-boxdark">
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <h4 className="text-4xl font-bold text-black dark:text-white">
                                {statistics?.totalRevenue}
                            </h4>
                            <span className="text-2xl">Total Revenue</span>
                        </div>
                        <FontAwesomeIcon icon={faMoneyBill} className="text-6xl" />
                    </div>
                </div>
                <div className="rounded-sm border border-stroke bg-white  py-10 px-8 shadow-lg dark:border-strokedark dark:bg-boxdark">
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <h4 className="text-4xl font-bold text-black dark:text-white">
                                {statistics?.totalProduct}
                            </h4>
                            <span className="text-2xl">Total Product</span>
                        </div>

                        <FontAwesomeIcon icon={faProductHunt} className="text-6xl" />
                    </div>
                </div>
                <div className="rounded-sm border border-stroke bg-white  py-10 px-8 shadow-lg dark:border-strokedark dark:bg-boxdark">
                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            <h4 className="text-4xl font-bold text-black dark:text-white">{statistics?.totalUsers}</h4>
                            <span className="text-2xl">Total Users</span>
                        </div>

                        <FontAwesomeIcon icon={faUser} className="text-6xl" />
                    </div>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-12 h-max gap-4 md:mt-6 md:gap-6 2xl:mt-8 2xl:gap-8">
                <div className="col-span-12 rounded-sm border shadow-lg border-stroke bg-white px-6 pt-8 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
                    <div className="flex flex-wrap items-start justify-center gap-3 sm:flex-nowrap">
                        <div className="flex ">
                            <span className="mt-1 mr-2 flex h-7 w-8 items-center justify-center rounded-full border border-blue-700">
                                <span className="block h-4 w-4 rounded-full bg-blue-700"></span>
                            </span>
                            <div className="w-full">
                                <p className="font-semibold text-center text-blue-700">Total Revenue {chosenYear}</p>
                            </div>
                        </div>
                        <div className="flex w-full max-w-45 justify-end">
                            <div className="inline-block z-10">
                                <YearPicker selected={chosenYear} onChange={handleChangeYear} className="z-10" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <ReactApexChart options={chartOneOpts} series={chartOneOpts.series} type="area" />
                    </div>
                </div>
                <div className="col-span-4">
                    <div className="col-span-12 mb-3 rounded-sm border border-stroke bg-white p-8 shadow-lg dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                        <div>
                            <ReactApexChart options={chartThreeOpts} series={chartThreeOpts.series} type="donut" />
                        </div>
                    </div>
                    <div className="col-span-12 mt-3 rounded-sm border border-stroke bg-white p-8 shadow-lg dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                        <div className="mb-4 justify-between gap-4 sm:flex">
                            <div>
                                <h4 className="text-3xl font-bold text-black dark:text-white">Week's Revenue</h4>
                            </div>
                            <div>
                                <div className="relative z-20 inline-block">
                                    <DatePicker onChange={handleChange} selected={chosenDate} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <ReactApexChart options={chartTwoOpts} series={chartTwoOpts.series} type="bar" />
                        </div>
                    </div>
                </div>
                <div class="rounded-sm col-span-12  border border-stroke bg-white px-5 pt-6 pb-3 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <h4 class="mb-6 text-3xl font-bold text-black dark:text-white">Top Users</h4>

                    <div class="flex flex-col">
                        <div class="grid grid-cols-3 rounded-lg bg-slate-200 dark:bg-meta-4 sm:grid-cols-4">
                            <div class="p-3 xl:p-5">
                                <h5 class="text-xl font-medium uppercase xsm:text-base">Username</h5>
                            </div>
                            <div class="p-3 text-center xl:p-5">
                                <h5 class="text-xl font-medium uppercase xsm:text-base">Total order</h5>
                            </div>
                            <div class="p-3 text-center xl:p-5">
                                <h5 class="text-xl font-medium uppercase xsm:text-base">Total Product Purchase</h5>
                            </div>
                            <div class="hidden p-3 text-center sm:block xl:p-5">
                                <h5 class="text-xl font-medium uppercase xsm:text-base">Total Pay (VND)</h5>
                            </div>
                        </div>
                        {statistics?.topTenUser.map((user) => {
                            return (
                                <div class="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-4">
                                    <div class="flex items-center gap-3 p-3 xl:p-5">
                                        <div class="flex-shrink-0">
                                            <img
                                                className="w-16 h-16 rounded-lg"
                                                src={`${process.env.REACT_APP_HOST}${user.avatar}`}
                                                alt="Brand"
                                            />
                                        </div>
                                        <p class="hidden font-medium text-black dark:text-white sm:block">
                                            {user.userName}
                                        </p>
                                    </div>

                                    <div class="flex items-center justify-center p-3 xl:p-5">
                                        <p class="font-medium text-black dark:text-white">{user.totalOrders}</p>
                                    </div>

                                    <div class="flex items-center justify-center p-3 xl:p-5">
                                        <p class="font-medium text-meta-3">{user.totalBought}</p>
                                    </div>

                                    <div class="hidden items-center justify-center p-3 sm:flex xl:p-5">
                                        <p class="font-medium text-black dark:text-white">{user.totalCost}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
