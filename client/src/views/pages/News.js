import React from 'react';
import axios from 'axios';

// Documentation: https://github.com/HackerNews/API

class News extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        axios.get("https://hacker-news.firebaseio.com/v0/item/9129911.json?print=pretty")
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                Hacker news.
            </div>
        );
    }
}

export default News;
