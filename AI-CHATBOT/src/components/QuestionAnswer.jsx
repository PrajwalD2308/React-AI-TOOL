import Answer from "./Answer";

const QuestionAnswer = ({ item, index, darkMode }) => {
  return (
    <>
      {/* Render question */}
      {item.type === "q" && (
        <li
          key={`q-${index}`}
          className={`text-right p-1 pr-4 border-8 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit flex justify-end ml-auto ${
            darkMode === "dark"
              ? "bg-zinc-700 border-zinc-700 text-zinc-200"
              : "bg-amber-200 border-amber-200 text-zinc-900"
          }`}
        >
          <Answer
            ans={item.text}
            totalResult={1}
            index={index}
            type={item.type}
          />
        </li>
      )}

      {/* Render answers */}
      {item.type === "a" && Array.isArray(item.text) && (
        <div>
          {item.text.map((ansItem, ansIndex) => (
            <li
              key={`a-${index}-${ansIndex}`}
              className={`flex justify-start text-left py-2 ${
                darkMode === "dark" ? "text-zinc-200" : "text-zinc-900"
              }`}
            >
              <Answer
                ans={ansItem}
                totalResult={item.text.length}
                type={item.type}
                index={ansIndex}
              />
            </li>
          ))}
        </div>
      )}
    </>
  );
};

export default QuestionAnswer;
