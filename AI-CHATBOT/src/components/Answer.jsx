import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { checkHeading, replaceHeadingStarts } from "../helper";
import atomDark from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";
import SyntaxHighlighter from "react-syntax-highlighter";

const Answer = ({ ans, totalResult, index }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStarts(ans));
    } else {
      setHeading(false);
      setAnswer(ans);
    }
  }, [ans]);

  const renderer = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <div className="not-prose">
          <SyntaxHighlighter
            {...props}
            children={String(children).replace(/\n$/, "")}
            language={match[1]}
            style={atomDark}
            preTag="div"
          />
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <>
      {index === 0 && totalResult > 1 ? (
        <h2 className="pt-2 text-2xl font-bold block dark:text-white text-zinc-800 leading-snug">
          {answer}
        </h2>
      ) : heading ? (
        <div className="pt-2">
          <h3 className="text-xl font-semibold dark:text-white text-zinc-800 leading-snug">
            {answer}
          </h3>
        </div>
      ) : (
        // Apply class to wrapper instead of ReactMarkdown directly

        <div className="overflow-x-auto w-full whitespace-normal">
          <ReactMarkdown components={renderer}>{answer}</ReactMarkdown>
        </div>
      )}
    </>
  );
};

export default Answer;
