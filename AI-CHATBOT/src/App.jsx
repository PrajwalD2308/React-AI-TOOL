import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { URL } from "./constants";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollToAns = useRef(null);

  const askQuestion = async () => {
    if (!question && !selectedHistory) {
      // alert("Please enter a question");
      return false;
    }
    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = [question, ...history];
        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history); // Update recentHistory state
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        setRecentHistory([question]);
      }
    }
    const payloadData = question ? question : selectedHistory;

    const payload = {
      contents: [
        {
          parts: [{ text: payloadData }],
        },
      ],
    };

    setLoading(true);

    try {
      let response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      response = await response.json();
      let dataString = response.candidates[0].content.parts[0].text;
      // dataString = dataString.split("*");
      // dataString = dataString.map((item) => item.trim());
      // Split only on * if used as delimiter (else fallback to \n\n or just use as single block)
      if (dataString.includes("*")) {
        dataString = dataString.split("*").map((item) => item.trim());
      } else {
        // Group by double newlines as a fallback to preserve paragraphs with numbering
        dataString = dataString.split(/\n\s*\n/).map((item) => item.trim());
      }

      // console.log(dataString);
      setResult([
        ...result,
        { type: "q", text: question ? question : selectedHistory },
        { type: "a", text: dataString },
      ]);
      setQuestion("");
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("The server is currently unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  // console.log(recentHistory);
  useEffect(() => {
    if (scrollToAns.current) {
      setTimeout(() => {
        scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
      }, 0);
    }
  }, [result]);

  // setTimeout(() => {
  //   scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
  // }, 500);
  // setLoading(false);

  const isEnter = (Event) => {
    console.log(Event.key);
    if (Event.key === "Enter") {
      Event.preventDefault();
      askQuestion();
    }
  };

  useEffect(() => {
    console.log(selectedHistory);
    askQuestion();
  }, [selectedHistory]);

  //dark mode
  const [darkMode, setDarkMode] = useState("dark");
  useEffect(() => {
    console.log(darkMode);
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode}>
      <div
        className={`grid grid-cols-5 min-h-screen text-center ${
          darkMode === "dark"
            ? "bg-zinc-900 text-zinc-300"
            : "bg-amber-50 text-zinc-900"
        }`}
      >
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
          darkMode={darkMode}
        />
        <div className="col-span-4 flex flex-col h-screen p-6">
          <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 font-bold  mb-4">
            Hello User,Ask me Anything ..!
          </h1>
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : null}

          {/* Output Section */}
          <div
            ref={scrollToAns}
            className={`flex-1 overflow-y-auto rounded-lg p-4 hide-scrollbar border ${
              darkMode === "dark"
                ? "bg-zinc-900 border-zinc-700"
                : "bg-amber-50 border-amber-200 text-zinc-900"
            }`}
            style={{ maxHeight: "calc(100vh - 160px)" }} // Adjust as needed
          >
            <div className="dark:text-zinc-300 text-zinc-900">
              <ul className="space-y-4">
                {result.map((item, index) => (
                  <QuestionAnswer
                    key={index}
                    item={item}
                    index={index}
                    darkMode={darkMode}
                  />
                ))}
              </ul>
              <select
                onChange={(Event) => setDarkMode(Event.target.value)}
                className="absolute top-4 right-4 p-6 "
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
              {/* <button
              onClick={() => setIsDark(!isDark)}
              className="absolute top-4 right-4 bg-gray-300 dark:bg-zinc-700 p-2 rounded-full"
            >
              {isDark ? "☀️" : "🌙"}
            </button> */}

              {/* <ul>
              {result &&
                result.map((item, index) => (
                  <li
                    key={index + Math.random()}
                    className="text-left py-1"
                    index={index}
                  >
                    <Answer ans={item} totalResult={result.length} />
                  </li>
                ))}
            </ul> */}
            </div>
          </div>
          {/* input box */}

          <div
            className={`w-full flex justify-center py-2 border-t px-6 ${
              darkMode === "dark"
                ? "bg-zinc-900 border-zinc-700"
                : "bg-amber-100 border-amber-200"
            }`}
            style={{ position: "sticky", bottom: 0 }}
          >
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl max-w-2xl w-full shadow-md border ${
                darkMode === "dark"
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-white border-amber-200 text-zinc-900"
              }`}
            >
              <input
                type="text"
                value={question}
                onKeyDown={isEnter}
                onChange={(e) => setQuestion(e.target.value)}
                className={`flex-1 h-10 bg-transparent outline-none text-sm placeholder-zinc-400 ${
                  darkMode === "dark" ? "text-white" : "text-black"
                }`}
                placeholder="Ask me anything"
              />
              {/* <button className="text-zinc-400 hover:text-white">
              <Mic size={20} />
            </button> */}
              <button
                onClick={askQuestion}
                className="ml-3 bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-1.5 rounded-xl transition "
              >
                Ask
                {/* <SendHorizonal size={18} /> */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
