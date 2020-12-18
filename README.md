# Wall Street Bet For Fools

Have you ever been on the popular subreddit Wall Street Bets? 

As I spend my time browsing what other people post on this forum, I begin to notice the value of information in some of these posts. How would I be able to transform this information into knowledge that would ultimately help me make money? 

Wall Street Bet For Fools is a REST API created to solve this problem. By using the Reddit API, WSB API categorized each post base on flair and tile, saving each processed post object in the database and returns calculated results.


## Install
    npm install   

## .env

    WSB_USER_AGENT=
    WSB_CLIENT_ID=
    WSB_CLIENT_SECRET=
    REDDIT_USER_ID=
    REDDIT_PASSWORD=
    MONGO_USER_ID=
    MONGO_PASSWORD=

## Run API Locally

    npm start

# REST API

The REST API to the example app is described below.

## Get list of Reddit post

### Request

`GET /stats/gain_loss/`

    curl -i -H 'Accept: application/json' 'localhost:3000/stats/gain_loss/post?interval=day'

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 10544
    ETag: W/"2930-k5qwupV038PBr5oGctE32yJcEEw"
    Date: Fri, 18 Dec 2020 19:49:14 GMT
    Connection: keep-alive

    {
    "summary": {
        "current_gain_loss_summary": {
            "gain_total": 112,
            "loss_total": 60,
            "index_total": 52
        },
        "previous_gain_loss_summary": {
            "gain_total": 209,
            "loss_total": 83,
            "index_total": 126
        },
        "gain_post_growth_rate": -0.46,
        "loss_post_growth_rate": -0.28,
        "total_post_growth_rate": -0.59,
        "volatility": 0
    },
    "data_used": [
        {
            "title": "DONT SLEEP ON CVS. IV is hella low premiums dirt cheap. And they're rolling out the vaccine. Let's get it",
            "flair": "Gain",
            "post_id": "",
            "date_created": "2020-12-11T20:56:05.334Z"
        },
        {
            "title": "feel free to pm me cum tributes",
            "flair": "Gain",
            "post_id": "",
            "date_created": "2020-12-11T20:56:05.334Z"
        }
    ]

## Get Top Stock Symbol

### Request

`Get /stock/top`

    curl -i -H 'Accept: application/json' 'curl -i 'http://localhost:3000/stats/stock/top?interval=week&top=10'
    
### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 381
    ETag: W/"17d-xif3/u0vcz5TjMl5ZGxwUBj4dj0"
    Date: Fri, 18 Dec 2020 20:00:18 GMT
    Connection: keep-alive
    
    {
      "topStock": [
          {
              "symbol": "PLTR",
              "noise": 101
          },
          {
              "symbol": "TSLA",
              "noise": 61
          },
          {
              "symbol": "GME",
              "noise": 51
          }
      ],
      "dates": {
          "start_date": "2020-12-11T20:01:58.000Z",
          "end_date": "2020-12-18T20:01:58.851Z"
      }
    }

