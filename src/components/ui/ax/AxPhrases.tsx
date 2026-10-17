export type AxPhrasesProps = {
  phrases: readonly string[];
};

/** 見出しや短い一文を、意味のまとまりの境目でだけ折り返す。幅が足りれば1行のまま。 */
export function AxPhrases({ phrases }: AxPhrasesProps) {
  return phrases.map((phrase, index) => (
    <span key={index} className="inline-block">
      {phrase}
    </span>
  ));
}
