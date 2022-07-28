
const navData = {
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
            name: 'Connections',
            url: '/connections',
            icon: 'Inbox'
        },
        {
            divider: true,
        },
        {
            name: 'News',
            url: '/news',
            icon: 'Globe',
        },
        {
            name: 'Entertainment',
            url: '/entertainment',
            icon: 'Headphones',
        },
        {
            divider: true,
        },
        {
            name: 'Admin',
            icon: 'Database',
            url: '/admin',
        },
    ],
    bottom: [
        {
            name: '',
            url: 'https://github.com/Tymotex/Techsuite',
            icon: 'GitHub',
            external: true,
            target: '_blank',
        }
    ],
};

export default navData;