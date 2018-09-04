import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

require('bootstrap/dist/css/bootstrap.min.css');
require('./assets/pages/waves/css/waves.min.css');
require('./assets/icon/feather/css/feather.css');
require('./assets/css/font-awesome.min.css');
//require('/assets/css/font-awesome-n.min.css');
require('./assets/pages/chart/radial/css/radial.css');
require('./assets/css/style.css');
require('./assets/css/widget.css');

require('jquery');
require('jquery-ui');
require('popper.js');
require('bootstrap');
require('./assets/js/pcoded.js');
require('./assets/js/vertical/vertical-layout.min.js');
// require('./assets/pages/waves/js/waves.min.js');
// require('./bower_components/jquery-slimscroll/js/jquery.slimscroll.js');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
