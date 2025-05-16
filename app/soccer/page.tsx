'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface Player {
  id: number;
  name: string;
  number: string;
  teamId?: number; // 添加teamId来标识队员属于哪个队伍
}

interface Captain {
  id: number;
  name: string;
  color: string;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '' });
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [newCaptain, setNewCaptain] = useState({ name: '' });
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isDistributing, setIsDistributing] = useState(false);

  // 分配顺序数组
  const distributionOrder = [0, 1, 2, 2, 1, 0];

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
    setCurrentTeamIndex(0);
    setIsDistributing(false);
  };

  // 添加队长
  const handleAddCaptain = () => {
    if (newCaptain.name && captains.length < 3) {
      const colors = ['bg-red-500', 'bg-white', 'bg-blue-500'];
      setCaptains([...captains, {
        id: Date.now(),
        name: newCaptain.name,
        color: colors[captains.length]
      }]);
      setNewCaptain({ name: '' });
    }
  };

  // 删除队长
  const handleDeleteCaptain = (id: number) => {
    setCaptains(captains.filter(captain => captain.id !== id));
  };

  // 重置队长
  const handleResetCaptains = () => {
    setCaptains([]);
    setCurrentTeamIndex(0);
    setIsDistributing(false);
  };

  // 开始分队
  const handleStartDistribution = () => {
    if (captains.length !== 3) {
      alert('请先选择3名队长！');
      return;
    }

    const unassignedPlayers = players.filter(player => player.teamId === undefined);
    if (unassignedPlayers.length === 0) {
      alert('所有队员已分配完毕！');
      return;
    }

    // 随机选择一个未分配的队员
    const randomIndex = Math.floor(Math.random() * unassignedPlayers.length);
    const selectedPlayer = unassignedPlayers[randomIndex];

    // 获取当前应该分配到的队伍索引
    const teamIndex = distributionOrder[currentTeamIndex % distributionOrder.length];

    // 更新队员的队伍信息
    setPlayers(players.map(player => 
      player.id === selectedPlayer.id 
        ? { ...player, teamId: teamIndex }
        : player
    ));

    // 更新下一个分配位置
    setCurrentTeamIndex(currentTeamIndex + 1);
    setIsDistributing(true);
  };

  // 重置分配
  const handleResetDistribution = () => {
    setPlayers(players.map(player => ({ ...player, teamId: undefined })));
    setCurrentTeamIndex(0);
    setIsDistributing(false);
  };

  // 获取每个队伍的队员
  const getTeamPlayers = (teamIndex: number) => {
    return players.filter(player => player.teamId === teamIndex);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">欢迎来到东升联赛前分队</h1>
        
        {/* Logo展示区域 */}
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32">
            <Image
              src="/logo.jpg"  // 这里需要您上传logo图片到public目录
              alt="东升联赛队徽"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* 标语 */}
        <h2 className="text-2xl font-bold text-center mb-8 text-red-600">
          公平 公开 公正
        </h2>

        {/* 队长预选区域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">队长预选</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="队长姓名"
              className="flex-1 p-2 border rounded"
              value={newCaptain.name}
              onChange={(e) => setNewCaptain({ name: e.target.value })}
            />
            <button
              onClick={handleAddCaptain}
              disabled={captains.length >= 3}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              添加队长
            </button>
            <button
              onClick={handleResetCaptains}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              重置队长
            </button>
          </div>
          
          {/* 队长卡片展示区域 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {captains.map((captain) => (
              <div
                key={captain.id}
                className={`${captain.color} rounded-lg shadow-md p-4 relative group ${
                  captain.color === 'bg-white' ? 'border border-gray-200' : ''
                }`}
              >
                <button
                  onClick={() => handleDeleteCaptain(captain.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <div className="text-center">
                  <div className={`text-lg font-semibold mb-1 ${
                    captain.color === 'bg-white' ? 'text-gray-800' : 'text-white'
                  }`}>
                    {captain.name}
                  </div>
                  <div className={`text-sm ${
                    captain.color === 'bg-white' ? 'text-gray-600' : 'text-white/80'
                  }`}>
                    队长
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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

        {/* 分队操作按钮 */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={handleStartDistribution}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
          >
            开始分队
          </button>
          <button
            onClick={handleResetDistribution}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            重置分配
          </button>
          <button
            onClick={handleResetPlayers}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            重置队员
          </button>
        </div>

        {/* 队伍展示区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {captains.map((captain, index) => (
            <div key={captain.id} className="space-y-4">
              {/* 队长卡片 */}
              <div className={`${captain.color} rounded-lg shadow-md p-4 relative ${
                captain.color === 'bg-white' ? 'border border-gray-200' : ''
              }`}>
                <div className="text-center">
                  <div className={`text-lg font-semibold mb-1 ${
                    captain.color === 'bg-white' ? 'text-gray-800' : 'text-white'
                  }`}>
                    {captain.name}
                  </div>
                  <div className={`text-sm ${
                    captain.color === 'bg-white' ? 'text-gray-600' : 'text-white/80'
                  }`}>
                    队长
                  </div>
                </div>
              </div>

              {/* 队员卡片 */}
              <div className="grid grid-cols-1 gap-2">
                {getTeamPlayers(index).map((player) => (
                  <div
                    key={player.id}
                    className={`${captain.color} rounded-lg shadow-md p-3 relative ${
                      captain.color === 'bg-white' ? 'border border-gray-200' : ''
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-base font-semibold ${
                        captain.color === 'bg-white' ? 'text-gray-800' : 'text-white'
                      }`}>
                        {player.name}
                      </div>
                      <div className={`text-sm ${
                        captain.color === 'bg-white' ? 'text-gray-600' : 'text-white/80'
                      }`}>
                        #{player.number}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 未分配队员展示区域 */}
        {!isDistributing && players.some(player => player.teamId === undefined) && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">未分配队员</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {players
                .filter(player => player.teamId === undefined)
                .map((player) => (
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
          </div>
        )}
      </main>
    </div>
  );
} 