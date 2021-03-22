import 'pages/proposals.scss';

import m from 'mithril';
import app from 'state';
import { Grid, Col, List, Tag } from 'construct-ui';

import { formatCoin } from 'adapters/currency';
import { formatDuration, blockperiodToDuration } from 'helpers';

import { ChainBase } from 'models';
import { CountdownUntilBlock } from 'views/components/countdown';
import Sublayout from 'views/sublayout';
import PageLoading from 'views/pages/loading';
import ProposalRow from 'views/components/proposal_row';
import Substrate from 'controllers/chain/substrate/main';
import Listing from './listing';
import ErrorPage from './error';

function getModules() {
  if (!app || !app.chain || !app.chain.loaded) {
    throw new Error('secondary loading cmd called before chain load');
  }
  if (app.chain.base === ChainBase.Substrate) {
    const chain = (app.chain as Substrate);
    return [ chain.bounties, chain.treasury ];
  } else {
    throw new Error('invalid chain');
  }
}

const BountyPage: m.Component<{}> = {
  view: (vnode) => {
    if (!app.chain || !app.chain.loaded) {
      if (app.chain?.base === ChainBase.Substrate && (app.chain as Substrate).chain?.timedOut) {
        return m(ErrorPage, {
          message: 'Chain connection timed out.',
          title: [
            'Bounties',
            m(Tag, { size: 'xs', label: 'Beta', style: 'position: relative; top: -2px; margin-left: 6px' })
          ],
        });
      }
      return m(PageLoading, {
        message: 'Connecting to chain',
        title: [
          'Bounties',
          m(Tag, { size: 'xs', label: 'Beta', style: 'position: relative; top: -2px; margin-left: 6px' })
        ],
        showNewProposalButton: true,
      });
    }

    const onSubstrate = app.chain?.base === ChainBase.Substrate;
    if (onSubstrate) {
      const modules = getModules();
      if (modules.some((mod) => !mod.ready)) {
        app.chain.loadModules(modules);
        return m(PageLoading, {
          message: 'Connecting to chain',
          title: [
            'Bounties',
            m(Tag, { size: 'xs', label: 'Beta', style: 'position: relative; top: -2px; margin-left: 6px' })
          ],
          showNewProposalButton: true,
        });
      }
    }

    const activeBounties = (app.chain as Substrate).bounties.store.getAll().filter((p) => !p.completed);
    const inactiveBounties = (app.chain as Substrate).bounties.store.getAll().filter((p) => p.completed);
    const activeBountyContent = activeBounties.length
      ? activeBounties.map((bounty) => m(ProposalRow, { proposal: bounty }))
      : [ m('.no-proposals', 'None') ];

    const inactiveBountyContent = inactiveBounties.length
      ? inactiveBounties.map((bounty) => m(ProposalRow, { proposal: bounty }))
      : [ m('.no-proposals', 'None') ];

    return m(Sublayout, {
      class: 'BountiesPage TreasuryPage',
      title: [
        'Bounties',
        m(Tag, { size: 'xs', label: 'Beta', style: 'position: relative; top: -2px; margin-left: 6px' })
      ],
      showNewProposalButton: true,
    }, [
      m(Grid, {
        align: 'middle',
        class: 'stats-container',
        gutter: 5,
        justify: 'space-between'
      }, [
        m(Col, { span: { xs: 6, md: 3 } }, [
          m('.stats-tile', [
            m('.stats-heading', 'Treasury balance'),
            app.chain && formatCoin((app.chain as Substrate).treasury.pot),
          ]),
        ]),
      ]),
      m(Listing, {
        content: activeBountyContent,
        columnHeader: 'Active Bounties',
      }),
      m(Listing, {
        content: inactiveBountyContent,
        columnHeader: 'Inactive Bounties',
      })
    ]);
  }
};

export default BountyPage;
