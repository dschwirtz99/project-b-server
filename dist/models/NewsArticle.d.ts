export interface NewsRow {
    id: number;
    title: string;
    description: string | null;
    source_name: string | null;
    source_url: string;
    thumbnail_url: string | null;
    published_at: string;
    fetched_at: string;
}
export declare function formatArticle(row: NewsRow): {
    id: number;
    title: string;
    description: string | null;
    sourceName: string | null;
    sourceUrl: string;
    thumbnailUrl: string | null;
    publishedAt: string;
    fetchedAt: string;
};
export declare function getNews(page?: number, limit?: number): {
    articles: {
        id: number;
        title: string;
        description: string | null;
        sourceName: string | null;
        sourceUrl: string;
        thumbnailUrl: string | null;
        publishedAt: string;
        fetchedAt: string;
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
export declare function insertArticle(article: Omit<NewsRow, 'id' | 'fetched_at'>): import("better-sqlite3").RunResult;
export declare function pruneOldArticles(daysOld?: number): import("better-sqlite3").RunResult;
//# sourceMappingURL=NewsArticle.d.ts.map