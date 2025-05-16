'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface Player {
  id: number;
  name: string;
  number: string;
  teamId?: number;
}

interface Captain {
  id: number;
  name: string;
  color: string;
  teamName: string; // 添加队伍名称
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '' });
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [newCaptain, setNewCaptain] = useState({ name: '', teamName: '' });
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isDistributing, setIsDistributing] = useState(false);
  const [teamCount, setTeamCount] = useState(3);
  const [distributionSpeed, setDistributionSpeed] = useState(500); // 分配动画速度

  // 分配顺序数组 - 优化分配顺序
  const getDistributionOrder = () => {
    if (teamCount === 2) {
      return [0, 1, 0, 1, 1, 0]; // 2队分配顺序，更均衡
    }
    return [0, 1, 2, 0, 2, 1, 1, 2, 0]; // 3队分配顺序，更均衡
  };

  // 获取队伍颜色和名称
  const getTeamInfo = () => {
    if (teamCount === 2) {
      return {
        colors: ['bg-red-600', 'bg-blue-600'], // 更深的颜色
        names: ['红队', '蓝队']
      };
    }
    return {
      colors: ['bg-red-600', 'bg-green-600', 'bg-blue-600'], // 更改中间队伍为绿色
      names: ['红队', '绿队', '蓝队']
    };
  };

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
    if (newCaptain.name && newCaptain.teamName && captains.length < teamCount) {
      const teamInfo = getTeamInfo();
      setCaptains([...captains, {
        id: Date.now(),
        name: newCaptain.name,
        color: teamInfo.colors[captains.length],
        teamName: newCaptain.teamName
      }]);
      setNewCaptain({ name: '', teamName: '' });
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

  // 切换队伍数量
  const handleTeamCountChange = (count: number) => {
    setTeamCount(count);
    setCaptains([]);
    setCurrentTeamIndex(0);
    setIsDistributing(false);
    setPlayers(players.map(player => ({ ...player, teamId: undefined })));
  };

  // 开始分队
  const handleStartDistribution = () => {
    if (captains.length !== teamCount) {
      alert(`请先选择${teamCount}名队长！`);
      return;
    }

    const unassignedPlayers = players.filter(player => player.teamId === undefined);
    if (unassignedPlayers.length === 0) {
      alert('所有队员已分配完毕！');
      return;
    }

    const randomIndex = Math.floor(Math.random() * unassignedPlayers.length);
    const selectedPlayer = unassignedPlayers[randomIndex];
    const distributionOrder = getDistributionOrder();
    const teamIndex = distributionOrder[currentTeamIndex % distributionOrder.length];

    // 添加分配动画效果
    const playerElement = document.getElementById(`player-${selectedPlayer.id}`);
    if (playerElement) {
      playerElement.classList.add('animate-bounce');
      setTimeout(() => {
        playerElement.classList.remove('animate-bounce');
      }, distributionSpeed);
    }

    setPlayers(players.map(player => 
      player.id === selectedPlayer.id 
        ? { ...player, teamId: teamIndex }
        : player
    ));

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
              src="/logo.jpg"
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

        {/* 队伍数量选择 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => handleTeamCountChange(2)}
            className={`px-6 py-2 rounded transition-all duration-300 ${
              teamCount === 2 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            2队模式
          </button>
          <button
            onClick={() => handleTeamCountChange(3)}
            className={`px-6 py-2 rounded transition-all duration-300 ${
              teamCount === 3 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            3队模式
          </button>
        </div>

        {/* 队长预选区域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">队长预选</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="队长姓名"
              className="flex-1 p-2 border rounded"
              value={newCaptain.name}
              onChange={(e) => setNewCaptain({ ...newCaptain, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="队伍名称"
              className="flex-1 p-2 border rounded"
              value={newCaptain.teamName}
              onChange={(e) => setNewCaptain({ ...newCaptain, teamName: e.target.value })}
            />
            <button
              onClick={handleAddCaptain}
              disabled={captains.length >= teamCount}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition-all duration-300"
            >
              添加队长
            </button>
            <button
              onClick={handleResetCaptains}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300"
            >
              重置队长
            </button>
          </div>
          
          {/* 队长卡片展示区域 */}
          <div className={`grid gap-4 mt-4 ${
            teamCount === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
          }`}>
            {captains.map((captain) => (
              <div
                key={captain.id}
                className={`${captain.color} rounded-lg shadow-md p-4 relative group transform hover:scale-105 transition-all duration-300`}
              >
                <button
                  onClick={() => handleDeleteCaptain(captain.id)}
                  className="absolute top-2 right-2 text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1 text-white">
                    {captain.name}
                  </div>
                  <div className="text-sm text-white/80">
                    {captain.teamName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 添加队员表单 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">添加新队员</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300"
            >
              添加队员
            </button>
          </div>
        </div>

        {/* 分队操作按钮 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <button
            onClick={handleStartDistribution}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            开始分队
          </button>
          <button
            onClick={handleResetDistribution}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-all duration-300"
          >
            重置分配
          </button>
          <button
            onClick={handleResetPlayers}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-all duration-300"
          >
            重置队员
          </button>
        </div>

        {/* 队伍展示区域 */}
        <div className={`grid gap-8 ${
          teamCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
        }`}>
          {captains.map((captain, index) => (
            <div key={captain.id} className="space-y-4">
              {/* 队长卡片 */}
              <div className={`${captain.color} rounded-lg shadow-md p-4 relative transform hover:scale-105 transition-all duration-300`}>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1 text-white">
                    {captain.name}
                  </div>
                  <div className="text-sm text-white/80">
                    {captain.teamName}
                  </div>
                </div>
              </div>

              {/* 队员卡片 */}
              <div className="grid grid-cols-1 gap-2">
                {getTeamPlayers(index).map((player) => (
                  <div
                    key={player.id}
                    id={`player-${player.id}`}
                    className={`${captain.color} rounded-lg shadow-md p-3 relative transform hover:scale-105 transition-all duration-300`}
                  >
                    <div className="text-center">
                      <div className="text-base font-semibold text-white">
                        {player.name}
                      </div>
                      <div className="text-sm text-white/80">
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
                    id={`player-${player.id}`}
                    className="bg-white rounded-lg shadow-md p-4 relative group transform hover:scale-105 transition-all duration-300"
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