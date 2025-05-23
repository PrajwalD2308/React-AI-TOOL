function RecentSearch({
  recentHistory,
  setRecentHistory,
  setSelectedHistory,
  darkMode,
}) {
  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };
  return (
    <>
      <div
        className={`col-span-1 p-2 rounded-xl shadow-md m-2 ${
          darkMode === "dark"
            ? "bg-zinc-400 text-zinc-300"
            : "bg-amber-100 text-black"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-4 flex text-center justify-center ${
            darkMode === "dark" ? "text-white" : "text-amber-700"
          }`}
        >
          <span>Recent History</span>
          <button onClick={clearHistory} className="cursor-pointer ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#e3e3e3"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </h2>

        <ul className="text-zinc-400 text-left overflow-auto text-sm">
          {recentHistory &&
            recentHistory.map((item, index) => (
              <li
                onClick={() => setSelectedHistory(item)}
                key={`recent-history-${index}`}
                className="text-sm  cursor-pointer p-2 truncate rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit dark:bg-zinc-700 bg-pink-200 dark:border-zinc-700  border-none  border-8 mb-2"
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
export default RecentSearch;
