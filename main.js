const discord = require('discord.js');
const Parser = require ('rss-parser');
const client = new discord.Client();
const parser = new Parser();
const rssChannelId = "nope";

let prevFeed;

client.on("ready", () => {
  console.log('rss bot ready');
});

let postRss = (rssItem) => {
  let rssChannel =  client.channels.cache.find(channel => channel.id === rssChannelId);
  rssChannel.send(
    `Titre : ${rssItem.title}\n` +
    `Date de parution : ${rssItem.pubDate}\n` +
    `Lien : ${rssItem.link}\n` +
    `Auteur : ${rssItem.author}`
  )
};

let getRss = async () => {// "() => {}" <=> function{
  let actualFeed = await parser.parseURL('https://fr.investing.com/rss/news_1.rss');
  if (actualFeed) {
    actualFeed.items.forEach((actualItem) => {
      if (prevFeed) {
        let prevFeedContainsActualItem = false;
        prevFeed.items.forEach((prevItem) => {
          if (actualItem.title === prevItem.title) {
            prevFeedContainsActualItem = true;
          }
        });
        if (!prevFeedContainsActualItem) {
          postRss(actualItem);
        }
      } else {
        postRss(actualItem);
      }
    });
    prevFeed = actualFeed;
  }
};

setInterval(() => {
  getRss().then();
}, 3000);

client.login("nope").then();