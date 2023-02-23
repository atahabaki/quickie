/*
 *  Quickie - Direct jump to search results.
 *  Copyright (C) 2021 A. Taha Baki
 *
 *  This file is part of Quickie.
 *
 *  Quickie is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Quickie is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Quickie.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * 
 * Replaces the first `{%query%}` match in the `url` String, and returns it.
 * 
 * @param {String} url 
 * @param {String} query 
 * @returns {String} generated query url
 */
const nav_url = (url, query) => {
  return url.replace("{%query%}", query);
};

chrome.omnibox.onInputEntered.addListener((input, disposition) => {
  let trimmed = input.trim();
  if (trimmed.length === 0)
    return;
  let words = trimmed.split(" ");
  // First word is the !Bang that we try to match
  let bang = words[0];
  // Search for !Bang match on bangs-index/bangs.json
  fetch("https://raw.githubusercontent.com/atahabaki/bangs-index/dev/bangs.json")
    .then(res => {
      if (!res.ok) return;
      return res.json();
    })
    .then(bangs => {
      let filter_res = bangs.bangs.filter(b => b.bang === bang);
      // If no match then search `input` with `chrome.search`
      if (filter_res.length === 0) {
        chrome.search.query({ text: input });
      }
      // If matches check words length
      // If 1 then directly jump to mainpage
      else if (filter_res.length === 1) {
        if (words.length === 1) {
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.update(tabs[0].id, { url: filter_res[0].homepage });
          });
        }
        // If >1 then search on that !Bang
        else if (words.length > 1) {
          words.shift();
          let query = words.join(" ");
          let url = nav_url(filter_res[0].search_url, query);
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.update(tabs[0].id, { url });
          });
        }
      }
    });
});