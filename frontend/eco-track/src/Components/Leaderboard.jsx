import React from "react";

const Leaderboard = ({ departments, currentDeptId }) => {
  // Sort departments by score (descending)
  const sorted = [...departments].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-green-100 text-green rounded-2xl shadow p-10 mt-20">
      <h2 className="text-xl text-black font-semibold mb-4">Department Leaderboard</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className=" text-left rounded-2xl ">
            <th className="p-2">Rank</th>
            <th className="p-2">Department</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((dept, index) => (
            <tr
              key={dept.id}
              className={`${
                dept.id === currentDeptId ? "bg-gradient-to-r from-green-600 to-teal-400 font-bold" : ""
              }`}
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{dept.name}</td>
              <td className="p-2">{dept.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
