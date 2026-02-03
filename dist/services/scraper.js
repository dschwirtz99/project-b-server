"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapePlayersFromProjectB = scrapePlayersFromProjectB;
exports.scrapeNewsFromWeb = scrapeNewsFromWeb;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const Player_1 = require("../models/Player");
const logger_1 = require("../utils/logger");
const PROJECT_B_URL = 'https://projectb.global';
function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
async function scrapePlayersFromProjectB() {
    try {
        logger_1.logger.info('Starting player scrape from projectb.global...');
        const { data: html } = await axios_1.default.get(PROJECT_B_URL, {
            headers: {
                'User-Agent': 'ProjectBTrackerApp/1.0',
            },
            timeout: 15000,
        });
        const $ = cheerio.load(html);
        // Attempt to find player sections - selectors may need updating
        // as the site evolves
        const playerElements = $('[class*="player"], [class*="roster"], [class*="athlete"]');
        let scrapedCount = 0;
        playerElements.each((_i, el) => {
            const $el = $(el);
            const name = $el.find('[class*="name"], h3, h4').first().text().trim();
            const position = $el.find('[class*="position"]').first().text().trim();
            const photoUrl = $el.find('img').first().attr('src') || null;
            if (name && name.length > 2) {
                (0, Player_1.upsertPlayer)({
                    name,
                    slug: slugify(name),
                    photo_url: photoUrl,
                    position: position || null,
                    nationality: null,
                    nationality_code: null,
                    team: null,
                    height_cm: null,
                    bio: null,
                    stats_json: null,
                    social_instagram: null,
                    social_twitter: null,
                    source_url: PROJECT_B_URL,
                });
                scrapedCount++;
            }
        });
        logger_1.logger.info(`Player scrape complete. Upserted ${scrapedCount} players.`);
    }
    catch (error) {
        logger_1.logger.error(`Player scrape failed: ${error.message}`);
    }
}
async function scrapeNewsFromWeb() {
    try {
        logger_1.logger.info('Scraping news from web sources...');
        // Scrape Google News search results as a fallback
        const query = encodeURIComponent('"Project B" basketball league');
        const { data: html } = await axios_1.default.get(`https://news.google.com/search?q=${query}&hl=en-US&gl=US&ceid=US:en`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000,
        });
        const $ = cheerio.load(html);
        const articles = [];
        $('article').each((_i, el) => {
            const title = $(el).find('a').first().text().trim();
            const url = $(el).find('a').first().attr('href') || '';
            const source = $(el).find('[class*="source"], time').first().text().trim();
            if (title && url) {
                articles.push({ title, url, source });
            }
        });
        logger_1.logger.info(`Scraped ${articles.length} news articles from web.`);
        return articles;
    }
    catch (error) {
        logger_1.logger.error(`Web news scrape failed: ${error.message}`);
        return [];
    }
}
//# sourceMappingURL=scraper.js.map