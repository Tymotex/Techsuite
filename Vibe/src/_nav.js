
export default {
  top: [
    {
      name: 'Home',
      url: '/home',
      icon: 'Home',
    },
    {
      name: 'Register',
      url: '/auth/register',
      icon: 'UserPlus',
    },
    {
      name: 'Log In',
      url: '/auth/login',
      icon: 'LogIn',
    },
    {
      name: 'Log Out',
      url: '/auth/logout',
      icon: 'LogOut'
    },
    {
      name: 'My Profile',
      url: '/profile',
      icon: 'Code',
    },
    {
      name: 'Channels',
      icon: 'Activity',
      children: [
        {
          name: 'All Channels',
          url: '/channels/all',
          badge: {
            variant: 'success',
            text: '10',
          },
        },
        {
          name: 'My Channels',
          url: '/channels/my',
          badge: {
            variant: 'success',
            text: '3',
          },
        },
        {
          name: 'Create a Channel',
          url: '/channels/new'
        }
      ]
    },
    {
      name: 'UI Elements',
      icon: 'Layers',
      children: [
        {
          name: 'Buttons',
          url: '/elements/buttons',
        },
        {
          name: 'Grid',
          url: '/elements/grid',
        },
        {
          name: 'Alerts',
          url: '/elements/alerts',
        },
        {
          name: 'Typography',
          url: '/elements/typography',
        },
        {
          name: 'Cards',
          url: '/elements/cards',
        },
        {
          name: 'Tabs',
          url: '/elements/tabs',
        },
        {
          name: 'Tables',
          url: '/elements/tables',
        },
        {
          name: 'Breadcrumbs',
          url: '/elements/breadcrumbs',
        },
        {
          name: 'Forms',
          url: '/elements/forms',
        },
        {
          name: 'Modals',
          url: '/elements/modals',
        },
        {
          name: 'Loaders',
          url: '/elements/loaders',
        },
        {
          name: 'Avatars',
          url: '/elements/avatars',
        },
        {
          name: 'Progress Bars',
          url: '/elements/progressbars',
        },
        {
          name: 'Pagination',
          url: '/elements/pagination',
        },
      ],
    },
    {
      name: 'Pages',
      icon: 'File',
      children: [
        {
          name: 'Blank',
          url: '/pages/blank',
        },
        {
          name: 'Sub Navigation',
          url: '/pages/subnav',
        },
        {
          name: '404',
          url: '/pages/404',
        },
      ],
    },
    {
      name: 'Apps',
      icon: 'Cloud',
      children: [
        {
          name: 'Analytics',
          url: '/apps/analytics',
        },
        {
          name: 'Invoice',
          url: '/apps/invoice',
        },
        {
          name: 'Activity Feed',
          url: '/apps/feed',
        },
        {
          name: 'CMS',
          url: '/apps/cms',
        },
      ],
    },
    {
      divider: true,
    },
    {
      name: 'Widgets',
      url: '/widgets',
      icon: 'Package',
      badge: {
        text: 'NEW',
      },
    },
  ],
  bottom: [
    {
      name: 'DevMessenger GitHub',
      url: 'https://github.com/Tymotex/DevMessenger',
      icon: 'GitHub',
      external: true,
      target: '_blank',
    }
  ],
};
