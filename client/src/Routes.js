import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Dashboard, NotFound } from './component/common';
import { Rigs } from './component/rigs';
import { Groups } from './component/groups';
import { MinerClient } from './component/minerClient';

const Routes = () => (
    <Switch>
        <Route path="/" exact activeClassName='active' component={Rigs} />
        <Route path="/miners" component={Rigs} />
        <Route path="/groups" component={Groups} />
        <Route path="/clients" component={MinerClient} />
        <Route path="/pool" component={()=> <div>Not Implemented Yet</div>} />
        <Route path="*" component={NotFound} />
    </Switch>
);

export default Routes;