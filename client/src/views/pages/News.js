import React from 'react';
import axios from 'axios';

// Documentation: https://github.com/HackerNews/API

class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stories: []
        }
    }

    UNSAFE_componentWillMount() {
        axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
            .then((res) => {
                // Top 500 stories:
                var i = 0;
                res.data.forEach((elem) => {
                    i++;
                    if (i < 10) {
                        axios.get(`https://hacker-news.firebaseio.com/v0/item/${elem}.json?print=pretty`)
                            .then((storyRes) => {
                                this.setState({
                                    stories: [...this.state.stories, storyRes.data]
                                });
                                console.log(this.state);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                });

                
                    
                // 
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                Hacker news.
                { this.state.stories.map(story => (
                    <div>
                        <a href={story.url}>{story.title}</a>
                    </div>
                )) }
            </div>
        );
    }
}

export default News;
