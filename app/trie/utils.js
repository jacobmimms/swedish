"use client";

export function searchTrie(trie, term) {
  // return the node of the trie that matches the term
  // this may contain a word and/or other nodes

  for (let i = 0; i < term.length; i++) {
    let char = term.charAt(i);
    if (trie[char]) {
      let next = trie[char];
      trie = next;
    } else {
      return null;
    }
  }
  return parseNode(trie);
}

export async function parseNode(node) {
  let result = {
    word: null,
    children: [],
  };
  if (node["is_word"]) {
    result.word = await JSON.parse(node["is_word"]);
  }
  for (let key in node) {
    if (key !== "is_word") {
      result.children.push(node[key]);
    }
  }
  return result;
}
