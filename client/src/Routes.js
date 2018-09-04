import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Dashboard, NotFound } from './component/common';
import { Rigs } from './component/rigs';

const Routes = () => (
    <Switch>
        <Route path="/" exact activeClassName='active' component={Dashboard} />
        <Route path="/rigs" component={Rigs} />
        <Route path="*" component={NotFound} />
    </Switch>
);

export default Routes;