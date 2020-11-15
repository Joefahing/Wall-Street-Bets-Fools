const Snoowrap = require('snoowrap');

const r = new Snoowrap({
    userAgent: 'Reddit Fools Dashboard',
    clientId: 'o-QzJfuiqLLYfg',
    clientSecret: 'OOqKgbE6GqS4kDhtV_sc3WWOcb8OiA',
    username: 'joefahing',
    password: 'alexmuir123'
});

r.getSubreddit('wallstreetbets').getNew
    ({
        limit: 10
    }).map(post => {
        return {
            title: post.title,
            flair: post.link_flair_text,
            content: post.selftext,
            created_date: post.created
        }
    }).then(post => console.log(post));


