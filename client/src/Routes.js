import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Dashboard, NotFound } from './component/common';
import { Rigs } from './component/rigs';
import { Groups } from './component/groups';
import { MinerClient } from './component/minerClient';
import { WalletList } from './component/wallet';
import { OptionList } from './component/options';
import { PoolList } from './component/pool';

const Routes = () => (
    <Switch>
        <Route path="/" exact activeClassName='active' component={Rigs} />
        <Route path="/miners" component={Rigs} />
        <Route path="/groups" component={Groups} />
        <Route path="/clients" component={MinerClient} />
        <Route path="/wallet" component={WalletList} />
        <Route path="/options" component={OptionList} />
        <Route path="/pool" component={PoolList} />
        <Route path="*" component={NotFound} />
    </Switch>
);

export default Routes;