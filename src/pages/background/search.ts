import uFuzzy from "@leeoniya/ufuzzy";
import { HistorySearchResult } from "./types";
import { faviconURL } from "../content/util/util";

export interface Searchable {
  url: string;
  title: string;
}

const opts = {
  intraMode: 1,
  intraIns: 1,
  //   // maxDistance: 0.4,
  //   // returnMatchData: true,
  //   // case-sensitive regexps
  //   interSplit: "[^A-Za-z\\d']+",
  //   intraSplit: "[a-z][A-Z]",
  //   intraBound: "[A-Za-z]\\d|\\d[A-Za-z]|[a-z][A-Z]",
  //   // case-insensitive regexps
  intraChars: "[a-z\\d']",
  //   intraContr: "'[a-z]{1,2}\\b",
};

const uf = new uFuzzy(opts);

interface ISearchable {
  searchTerm: string;
}

function search<Type extends ISearchable>(
  query: string,
  values: Type[]
): Type[] {
  const results = uf.search(
    values.map((_) => _.searchTerm),
    query
  );
  const idxs = results[0];
  return idxs?.map((idx) => values[idx]) ?? [];
}

// Returns indices
function search2(query: string, values: string[]): number[] {
  const results = uf.search(values, query);
  const idxs = results[0];
  return idxs?.map((idx) => idx) ?? [];
}

export const SearchEngine = {
  fn: async (query: string) => {
    return new Promise((resolve, reject) => {
      const foundHistoryItems: HistorySearchResult[] = [];
      const seenUrls = new Set();

      chrome.history.search(
        {
          text: "",
          maxResults: 10000,
          //   maxResults: 100000,
          startTime: new Date().setDate(new Date().getDate() - 360),
        },
        (histories) => {
          const results = search2(
            query,
            histories.map((h) => h.title! + h.url!)
            // histories.map((h) => ({
            //   ...h,
            //   searchTerm: h.title! + h.url!,
            // }))
          ).map((idx) => histories[idx]);

          results.forEach((item) => {
            if (seenUrls.has(item.url)) return;
            seenUrls.add(item.url);

            foundHistoryItems.push({
              id: item.id,
              title: item.title ?? item.url ?? "",
              url: item.url ?? "",
              favicon: faviconURL(item.url!),
              visitCount: item.visitCount ?? 0,
              lastVisitTime: item.lastVisitTime
                ? new Date(item.lastVisitTime).toLocaleString("en-us", {
                    // weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })
                : "",
            } as HistorySearchResult);
          });
          // limit max number of returned results
          resolve(foundHistoryItems.slice(0, 100));
        }
      );
    });
  },
};
