export type AxRichParagraphBlock = {
  text: string;
  /** text 内の一部。本文と同じサイズのまま太字にする */
  emphasis?: string;
  /** 実際の発言・引用だけに使う */
  variant?: "quote";
};

export type AxRichParagraphProps = {
  block: AxRichParagraphBlock;
  className?: string;
  emphasisClassName: string;
  quoteClassName: string;
};

export function AxRichParagraph({
  block,
  className,
  emphasisClassName,
  quoteClassName,
}: AxRichParagraphProps) {
  if (block.variant === "quote") {
    return <p className={quoteClassName}>{block.text}</p>;
  }
  if (!block.emphasis || !block.text.includes(block.emphasis)) {
    return <p className={className}>{block.text}</p>;
  }
  const [before, after] = block.text.split(block.emphasis);
  return (
    <p className={className}>
      {before}
      <strong className={emphasisClassName}>{block.emphasis}</strong>
      {after}
    </p>
  );
}
