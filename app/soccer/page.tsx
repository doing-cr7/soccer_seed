'use client';
import React, { useState } from 'react';

interface Player {
  id: number;
  name: string;
  number: string;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '' });

  // 添加队员
  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.number) {
      setPlayers([...players, {
        id: Date.now(),
        name: newPlayer.name,
        number: newPlayer.number
      }]);
      setNewPlayer({ name: '', number: '' });
    }
  };

  // 删除队员
  const handleDeletePlayer = (id: number) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  // 重置队员
  const handleResetPlayers = () => {
    setPlayers([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">欢迎来到东升联赛前分队</h1>
        
        {/* 添加队员表单 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">添加新队员</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="队员姓名"
              className="flex-1 p-2 border rounded"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="球衣号码"
              className="w-32 p-2 border rounded"
              value={newPlayer.number}
              onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
            />
            <button
              onClick={handleAddPlayer}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              添加队员
            </button>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={handleResetPlayers}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            重置队员
          </button>
        </div>

        {/* 队员卡片展示区域 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-lg shadow-md p-4 relative group"
            >
              <button
                onClick={() => handleDeletePlayer(player.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">{player.name}</div>
                <div className="text-sm text-gray-600">#{player.number}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 