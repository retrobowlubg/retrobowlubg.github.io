// ******************************
// Tingly Builder JavaScript file
// ******************************

//Publisher.js file Example.
//Last Update: November 2015

//First, let’s describe the game a bit. These are the variables
//you should reference in your Booster API initialization in
//your index.html
var publisher = {

    gameName: "Daily Sudoku (FB Version)",
    gameVersion: "1.02",
    gameCategory: "Puzzle",
    developerId: "0001", //Provided by Booster
    gameCode: "0001-cg_daily_sud", //Provided by Booster
    gameAnalyticsId: "",

    //Now, on to advertising settings.  Please leave these
    //placeholder values as-is when implementing.

    adChannel: 0,

    enableAds: true,
    adFreq: "60",
    firstAd: "60",

    //Controlling More Games behavior…
    moreGames: true,
    moreGamesURL: "http://www.coolgames.com",

    yahoo: false,

    //Reward Video Ids
    desktopRewardId: 0,
    mobileRewardId: 0
};

window.RewardedVideoConfig = {
    AdTech: {
        adtechZones: {
            mobile: 4103,
            desktop: 4102
        }
    },
    HyperMx: {
        descriptor: {
            frameClass: "adFrame",
            adClass: "hypermx",
            width: 800,
            height: 540
        },
        distId: 80801202,
        siteId: "jewel_academy_prod"
    }
};