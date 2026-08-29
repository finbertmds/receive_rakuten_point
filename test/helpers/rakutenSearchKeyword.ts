// rakutenSearchKeyword.ts

import fs from "node:fs";
import path from "node:path";
import config from "../../config";

type HistoryItem = {
    date: string;
    keyword: string;
};

const HISTORY_FILE = path.resolve(
    process.cwd(),
    "data/rakuten-search-history.json"
);

function loadHistory(): HistoryItem[] {
    try {
        if (!fs.existsSync(HISTORY_FILE)) {
            return [];
        }

        return JSON.parse(
            fs.readFileSync(HISTORY_FILE, "utf8")
        );
    } catch {
        return [];
    }
}

function saveHistory(history: HistoryItem[]) {
    fs.mkdirSync(
        path.dirname(HISTORY_FILE),
        { recursive: true }
    );

    fs.writeFileSync(
        HISTORY_FILE,
        JSON.stringify(history, null, 2),
        "utf8"
    );
}

function createCandidates(): string[] {
    const candidates: string[] = [];

    for (const template of config.RAKUTEN_SUPER_POINT_SCREEN_SEARCH_TEMPLATES) {
        for (const category of config.RAKUTEN_SUPER_POINT_SCREEN_SEARCH_CATEGORIES) {
            candidates.push(
                template.replace(
                    "{category}",
                    category
                )
            );
        }
    }

    return candidates;
}

export function generateRakutenSearchKeyword(): string {
    const history = loadHistory();

    const used = new Set(
        history.map(x => x.keyword)
    );

    const candidates = createCandidates()
        .filter(keyword => !used.has(keyword));

    if (candidates.length === 0) {
        throw new Error(
            "No unused Rakuten search keywords remain."
        );
    }

    // random
    const index = Math.floor(
        Math.random() * candidates.length
    );

    const keyword = candidates[index];

    history.push({
        date: new Date().toISOString(),
        keyword,
    });

    saveHistory(history);

    return keyword;
}