// import Dashboard from './pages/Dashboard';


// Content pages:
import ChannelsAll from './pages/ChannelsAll';
import ChannelsMy from './pages/ChannelsMy';
import ChannelsNew from './pages/ChannelsNew';
import Channel from './pages/Channel';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import News from './pages/News';
import Entertainment from './pages/Entertainment';
import Admin from './pages/Admin'
import Connections from './pages/Connections'; 

// Other elements:
import Buttons from './elements/Buttons';
import Alerts from './elements/Alerts';
import Grid from './elements/Grid';
import Typography from './elements/Typography';
import Cards from './elements/Cards';
import Tabs from './elements/Tabs';
import Tables from './elements/Tables';
import Breadcrumbs from './elements/Breadcrumbs';
import Forms from './elements/Forms';
import Loaders from './elements/Loaders';
import Avatars from './elements/Avatars';
import Invoice from './pages/Invoice';
import Analytics from './pages/Analytics';
import CmsPage from './pages/Cms';
import BlankPage from './pages/BlankPage';
import SubNav from './pages/SubNav';
import Feed from './pages/Feed';
import Modals from './elements/Modals';
import ProgressBars from './elements/ProgressBars';
import PaginationPage from './elements/Pagination';
import ErrorPage from './pages/404';


const pageList = [
  {
    name: 'Home',
    path: '/home',
    component: Home,
  },
  {
    name: 'Register',
    path: '/auth/register',
    component: Register,
  },
  {
    name: 'Login',
    path: '/auth/login',
    component: Login,
  },
  {
    name: 'Profile',
    path: '/user/profile/:userID/edit',
    component: ProfileEdit,
  },
  {
    name: 'Profile',
    path: '/user/profile/:userID',
    component: Profile,
  },
  {
    name: 'Channel',
    path: '/channel/:channelID',
    component: Channel
  },
  {
    name: 'All Channels',
    path: '/channels/all',
    component: ChannelsAll,
  },
  {
    name: 'My Channels',
    path: '/channels/my',
    component: ChannelsMy,
  },
  {
    name: 'Create a Channel',
    path: '/channels/new',
    component: ChannelsNew,
  },
  {
    name: 'Connections',
    path: '/connections',
    component: Connections
  },
  {
    name: 'News',
    path: '/news',
    component: News,
  },
  {
    name: 'Entertainment',
    path: '/entertainment',
    component: Entertainment,
  },
  {
    name: 'Admin',
    path: '/admin',
    component: Admin,
  },
  {
    name: 'Buttons',
    path: '/elements/buttons',
    component: Buttons,
  },
  {
    name: 'Alerts',
    path: '/elements/alerts',
    component: Alerts,
  },
  {
    name: 'Grid',
    path: '/elements/grid',
    component: Grid,
  },
  {
    name: 'Typography',
    path: '/elements/typography',
    component: Typography,
  },
  {
    name: 'Cards',
    path: '/elements/cards',
    component: Cards,
  },
  {
    name: 'Tabs',
    path: '/elements/tabs',
    component: Tabs,
  },
  {
    name: 'Tables',
    path: '/elements/tables',
    component: Tables,
  },
  {
    name: 'Progress Bars',
    path: '/elements/progressbars',
    component: ProgressBars,
  },
  {
    name: 'Pagination',
    path: '/elements/pagination',
    component: PaginationPage,
  },
  {
    name: 'Modals',
    path: '/elements/modals',
    component: Modals,
  },
  {
    name: 'Breadcrumbs',
    path: '/elements/breadcrumbs',
    component: Breadcrumbs,
  },
  {
    name: 'Forms',
    path: '/elements/forms',
    component: Forms,
  },
  {
    name: 'Loaders',
    path: '/elements/loaders',
    component: Loaders,
  },
  {
    name: 'Avatars',
    path: '/elements/avatars',
    component: Avatars,
  },
  {
    name: 'Blank',
    path: '/pages/blank',
    component: BlankPage,
  },
  {
    name: 'Sub Navigation',
    path: '/pages/subnav',
    component: SubNav,
  },
  {
    name: '404',
    path: '/pages/404',
    component: ErrorPage,
  },
  {
    name: 'Analytics',
    path: '/apps/analytics',
    component: Analytics,
  },
  {
    name: 'Activity Feed',
    path: '/apps/feed',
    component: Feed,
  },
  {
    name: 'Invoice',
    path: '/apps/invoice',
    component: Invoice,
  },
  {
    name: 'CMS',
    path: '/apps/cms',
    component: CmsPage,
  }
];

export default pageList;
