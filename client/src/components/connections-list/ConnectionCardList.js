import React from 'react';
import ConnectionCard from './ConnectionCard';
import './Card.scss';

class ConnCard extends React.Component {

    render() {
        return (
            <section class="card-list">
                {/* {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1].map(() => (
                    <ConnectionCard />
                ))} */}
        
        
        
                <article class="card">
                <header class="card-header">
                    <p>Sep 11th 2020</p>
                    <h2>Card Tricks are fun!</h2>
                </header>
        
                <div class="card-author">
                    <a class="author-avatar" href="#">
                    <img src="https://api.adorable.io/avatars/172/a.png" />
                    </a>
                    <svg class="half-circle" viewBox="0 0 106 57">
                    <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                    </svg>
        
                    <div class="author-name">
                    <div class="author-name-prefix">Pirate</div>
                    Zheng Zhilong
                    </div>
                </div>
                <div class="tags">
                    <a href="#">html</a>
                    <a href="#">css</a>
                </div>
                </article>
        
        
        
        
                <article class="card">
                <header class="card-header">
                    <p>Sep 11th 2020</p>
                    <h2>Card Tricks are fun!</h2>
                </header>
        
                <div class="card-author">
                    <a class="author-avatar" href="#">
                    <img src="https://api.adorable.io/avatars/172/b.png" />
                    </a>
                    <svg class="half-circle" viewBox="0 0 106 57">
                    <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                    </svg>
        
                    <div class="author-name">
                    <div class="author-name-prefix">Pirate</div>
                    Francis Drake
                    </div>
                </div>
                <div class="tags">
                    <a href="#">html</a>
                    <a href="#">css</a>
                </div>
                </article>
        
                <article class="card">
                <header class="card-header">
                    <p>Sep 11th 2020</p>
                    <h2>Card Tricks are fun!</h2>
                </header>
        
                <div class="card-author">
                    <a class="author-avatar" href="#">
                    <img src="https://api.adorable.io/avatars/172/c.png" />
                    </a>
                    <svg class="half-circle" viewBox="0 0 106 57">
                    <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                    </svg>
        
                    <div class="author-name">
                    <div class="author-name-prefix">Pirate</div>
                    Edward Teach
                    </div>
                </div>
                <div class="tags">
                    <a href="#">html</a>
                    <a href="#">css</a>
                </div>
                </article>
        
        
                <article class="card">
                <header class="card-header">
                    <p>Sep 11th 2020</p>
                    <h2>Card Tricks are fun!</h2>
                </header>
        
                <div class="card-author">
                    <a class="author-avatar" href="#">
                    <img src="https://api.adorable.io/avatars/172/d.png" />
                    </a>
                    <svg class="half-circle" viewBox="0 0 106 57">
                    <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                    </svg>
        
                    <div class="author-name">
                    <div class="author-name-prefix">Pirate</div>
                    William Kidd
                    </div>
                </div>
                <div class="tags">
                    <a href="#">html</a>
                    <a href="#">css</a>
                </div>
                </article>
        
                <article class="card">
                <header class="card-header">
                    <p>Sep 11th 2020</p>
                    <h2>Card Tricks are fun!</h2>
                </header>
        
                <div class="card-author">
                    <a class="author-avatar" href="#">
                    <img src="https://api.adorable.io/avatars/172/d.png" />
                    </a>
                    <svg class="half-circle" viewBox="0 0 106 57">
                    <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                    </svg>
        
                    <div class="author-name">
                    <div class="author-name-prefix">Pirate</div>
                    William Kidd
                    </div>
                </div>
                <div class="tags">
                    <a href="#">html</a>
                    <a href="#">css</a>
                </div>
                </article>
        
                <article class="card">
                <header class="card-header">
                    <p>Sep 11th 2020</p>
                    <h2>Card Tricks are fun!</h2>
                </header>
        
                <div class="card-author">
                    <a class="author-avatar" href="#">
                    <img src="https://api.adorable.io/avatars/172/d.png" />
                    </a>
                    <svg class="half-circle" viewBox="0 0 106 57">
                    <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                    </svg>
        
                    <div class="author-name">
                    <div class="author-name-prefix">Pirate</div>
                    William Kidd
                    </div>
                </div>
                <div class="tags">
                    <a href="#">html</a>
                    <a href="#">css</a>
                </div>
                </article>
            </section>
        );
    }
}

export default ConnCard;
