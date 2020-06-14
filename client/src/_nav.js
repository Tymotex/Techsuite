
export default {
  top: [
    {
      name: 'Home',
      url: '/home',
      icon: 'Home',
    },
    {
      divider: true,
    },
    {
      name: 'Channels',
      icon: 'Activity',
      children: [
        {
          name: 'All Channels',
          url: '/channels/all'
        },
        {
          name: 'My Channels',
          url: '/channels/my'
        },
        {
          name: 'Create a Channel',
          url: '/channels/new'
        }
      ]
    },
    {
      divider: true,
    },
    {
      name: 'News',
      url: '/news',
      icon: 'Globe',
    }
  ],
  bottom: [
    {
      name: 'GitHub Repo',
      url: 'https://github.com/Tymotex/DevMessenger',
      icon: 'GitHub',
      external: true,
      target: '_blank',
    }
  ],
};
