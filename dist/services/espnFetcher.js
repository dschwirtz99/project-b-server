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
exports.enrichPlayerStats = enrichPlayerStats;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const database_1 = require("../config/database");
const logger_1 = require("../utils/logger");
// ESPN player page URLs for known players
const ESPN_PLAYER_URLS = {
    'nneka-ogwumike': 'https://www.espn.com/wnba/player/_/id/2491205/nneka-ogwumike',
    'alyssa-thomas': 'https://www.espn.com/wnba/player/_/id/2529184/alyssa-thomas',
    'jonquel-jones': 'https://www.espn.com/wnba/player/_/id/3149391/jonquel-jones',
    'jewell-loyd': 'https://www.espn.com/wnba/player/_/id/2999048/jewell-loyd',
    'kelsey-mitchell': 'https://www.espn.com/wnba/player/_/id/3908809/kelsey-mitchell',
    'kamilla-cardoso': 'https://www.espn.com/wnba/player/_/id/4902248/kamilla-cardoso',
    'sophie-cunningham': 'https://www.espn.com/wnba/player/_/id/4066310/sophie-cunningham',
};
async function scrapeESPNPlayerStats(url) {
    try {
        const { data: html } = await axios_1.default.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000,
        });
        const $ = cheerio.load(html);
        const stats = {};
        // Try to extract key stats from the player page
        $('[class*="StatBlock"], [class*="stat"]').each((_i, el) => {
            const label = $(el).find('[class*="label"], dt').text().trim().toLowerCase();
            const value = $(el).find('[class*="value"], dd').text().trim();
            if (label && value) {
                stats[label] = value;
            }
        });
        return Object.keys(stats).length > 0 ? stats : null;
    }
    catch {
        return null;
    }
}
async function enrichPlayerStats() {
    logger_1.logger.info('Starting player stats enrichment from ESPN...');
    const db = (0, database_1.getDatabase)();
    let enrichedCount = 0;
    for (const [slug, url] of Object.entries(ESPN_PLAYER_URLS)) {
        try {
            const freshStats = await scrapeESPNPlayerStats(url);
            if (freshStats) {
                // Merge with existing stats rather than replacing
                const existing = db.prepare('SELECT stats_json FROM players WHERE slug = ?').get(slug);
                const existingStats = existing?.stats_json ? JSON.parse(existing.stats_json) : {};
                const merged = { ...existingStats, ...freshStats, espn_updated: new Date().toISOString() };
                db.prepare('UPDATE players SET stats_json = ?, updated_at = datetime(\'now\') WHERE slug = ?')
                    .run(JSON.stringify(merged), slug);
                enrichedCount++;
            }
            // Be polite to ESPN servers
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        catch (error) {
            logger_1.logger.error(`Failed to enrich stats for ${slug}: ${error.message}`);
        }
    }
    logger_1.logger.info(`Stats enrichment complete. Updated ${enrichedCount} players.`);
}
//# sourceMappingURL=espnFetcher.js.map