export interface PlayerRow {
    id: number;
    name: string;
    slug: string;
    photo_url: string | null;
    position: string | null;
    nationality: string | null;
    nationality_code: string | null;
    team: string | null;
    height_cm: number | null;
    bio: string | null;
    stats_json: string | null;
    social_instagram: string | null;
    social_twitter: string | null;
    source_url: string | null;
    created_at: string;
    updated_at: string;
}
export declare function formatPlayer(row: PlayerRow): {
    id: number;
    name: string;
    slug: string;
    photoUrl: string | null;
    position: string | null;
    nationality: string | null;
    nationalityCode: string | null;
    team: string | null;
    heightCm: number | null;
    bio: string | null;
    stats: any;
    socialInstagram: string | null;
    socialTwitter: string | null;
    createdAt: string;
    updatedAt: string;
};
export declare function getAllPlayers(filters: {
    team?: string;
    position?: string;
    nationality?: string;
    search?: string;
}): {
    id: number;
    name: string;
    slug: string;
    photoUrl: string | null;
    position: string | null;
    nationality: string | null;
    nationalityCode: string | null;
    team: string | null;
    heightCm: number | null;
    bio: string | null;
    stats: any;
    socialInstagram: string | null;
    socialTwitter: string | null;
    createdAt: string;
    updatedAt: string;
}[];
export declare function getPlayerBySlug(slug: string): {
    id: number;
    name: string;
    slug: string;
    photoUrl: string | null;
    position: string | null;
    nationality: string | null;
    nationalityCode: string | null;
    team: string | null;
    heightCm: number | null;
    bio: string | null;
    stats: any;
    socialInstagram: string | null;
    socialTwitter: string | null;
    createdAt: string;
    updatedAt: string;
} | null;
export declare function upsertPlayer(player: Partial<PlayerRow>): import("better-sqlite3").RunResult;
//# sourceMappingURL=Player.d.ts.map