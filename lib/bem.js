import { bemMap } from "@/lib/bem-map";

export function bem(...tokens) {
  return tokens
    .flat()
    .filter(Boolean)
    .map((token) => (bemMap[token] ? bemMap[token] : token))
    .join(" ");
}
