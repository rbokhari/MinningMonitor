import React from 'react';

const Dashboard = () => (
    <div className="pcoded-content">
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <div className="page-header-title">
                            <h5 className="m-b-10">Dashboard</h5>
                        </div>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="feather icon-home"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item"><a href="#!">Dashboard</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className="pcoded-inner-content">
            <div className="main-body">
                <div className="page-wrapper">
                    <div className="page-body">
                        <div className="row">
                            <div className="col-xl-3 col-md-6">
                                <div className="card o-hidden bg-c-blue web-num-card">
                                    <div className="card-block text-white">
                                        <h5 className="m-t-15">Total Hashrate</h5>
                                        <h3 className="m-b-15">53,120</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6">
                                <div className="card o-hidden bg-c-green web-num-card">
                                    <div className="card-block text-white">
                                        <h5 className="m-t-15">Total GPU</h5>
                                        <h3 className="m-b-15">2,536</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6">
                                <div className="card o-hidden bg-c-red web-num-card">
                                    <div className="card-block text-white">
                                        <h5 className="m-t-15">Total Miners</h5>
                                        <h3 className="m-b-15">1 / 40</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6">
                                <div className="card o-hidden bg-c-yellow web-num-card">
                                    <div className="card-block text-white">
                                        <h5 className="m-t-15">Unpaid Balance</h5>
                                        <h3 className="m-b-15">$ 421,980</h3>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Dashboard;