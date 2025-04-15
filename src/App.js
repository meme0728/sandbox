import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdditionGame = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTime, setSelectedTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [scoreHistory, setScoreHistory] = useState([]);

  // 新しい問題を生成する関数
  const generateNewQuestion = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setUserAnswer('');
    setFeedback('');
  };

  // ゲームを開始する関数
  const startGame = () => {
    setGameActive(true);
    setGameStarted(true);
    setScore(0);
    setTimeLeft(selectedTime);
    setShowTimer(true);
    generateNewQuestion();
  };

  // 答えを確認する関数
  const checkAnswer = () => {
    const correctAnswer = num1 + num2;
    const userAnswerNum = parseInt(userAnswer, 10);

    if (userAnswerNum === correctAnswer) {
      setFeedback('正解！👍');
      setScore(score + 1);
      generateNewQuestion();
    } else {
      setFeedback(`不正解です。正解は ${correctAnswer} でした。`);
      generateNewQuestion();
    }
  };

  // 数字ボタンがクリックされたときの処理
  const handleNumberClick = (num) => {
    if (gameActive) {
      setUserAnswer(userAnswer + num);
    }
  };

  // 入力をクリアする処理
  const handleClear = () => {
    setUserAnswer('');
  };

  // キーボードでEnterを押した時の処理
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && gameActive) {
      checkAnswer();
    }
  };

  // タイマー機能
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // タイマーが10秒経過したらタイマーを非表示にする
        if (timeLeft === selectedTime - 10) {
          setShowTimer(false);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      setFeedback(`ゲーム終了！あなたのスコアは ${score} 点です！`);
      // スコア履歴を更新
      // setScoreHistory([...scoreHistory, {
      //   回数: scoreHistory.length + 1,
      //   スコア: score,
      //   制限時間: selectedTime === 30 ? '30秒' : '1分'
      // }]);
      // タイマー表示をリセット
      setShowTimer(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, score, selectedTime, scoreHistory]);

  return (
    <div className="flex flex-col items-center justify-center min-h-64 bg-gray-100 p-8 rounded-lg shadow-md">
      {!gameStarted ? (
        <div className="text-center w-full">
          <h1 className="text-5xl font-bold mb-6 text-blue-600">足し算ゲーム</h1>
          <p className="text-2xl mb-6">制限時間内で何問解けるかな？</p>
          
          <div className="mb-8">
            <p className="text-xl mb-4 font-bold">制限時間を選択：</p>
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => setSelectedTime(30)}
                className={`px-6 py-3 rounded-lg text-xl font-bold ${
                  selectedTime === 30 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                30秒
              </button>
              <button 
                onClick={() => setSelectedTime(60)}
                className={`px-6 py-3 rounded-lg text-xl font-bold ${
                  selectedTime === 60 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                1分
              </button>
            </div>
          </div>
          
          <button 
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl mb-8"
          >
            げーむスタート
          </button>
{/*           
          {scoreHistory.length > 0 && (
            <div className="mt-6 w-full">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">スコア履歴</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="回数" label={{ value: 'ゲーム回数', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'スコア', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => `${label}回目`}
                      contentStyle={{ fontSize: '16px' }}
                    />
                    <Bar dataKey="スコア" fill="#8884d8" name="スコア" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-lg">
                {scoreHistory.map((record, index) => (
                  <div key={index} className="mb-2">
                    {index + 1}回目: {record.スコア}点 ({record.制限時間})
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
      ) : !gameActive ? (
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-blue-600">ゲーム終了</h1>
          <p className="text-2xl mb-6">{feedback}</p>
          <button 
            onClick={() => {
              setGameStarted(false);
              setSelectedTime(30);
              setTimeLeft(30);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl"
          >
            もう一度プレイ
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex justify-between w-full mb-6">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xl">
              スコア: {score}
            </div>
            <div 
              className={`bg-red-500 text-white px-4 py-2 rounded-lg text-xl transition-opacity duration-1000 ${
                showTimer ? 'opacity-100' : 'opacity-0'
              }`}
            >
              残り時間: {timeLeft}秒
            </div>
          </div>
          
          <div className="text-4xl mb-6">
            {num1} + {num2} = ?
          </div>
          
          <div className="mb-6">
            <input 
              type="text" 
              value={userAnswer} 
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 w-40 text-center text-3xl"
              autoFocus
              readOnly
            />
          </div>
          
          {/* 数字ボタン */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button 
                key={num} 
                onClick={() => handleNumberClick(num.toString())}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg text-3xl"
              >
                {num}
              </button>
            ))}
            <button 
              onClick={handleClear}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg text-2xl col-span-2"
            >
              クリア
            </button>
            <button 
              onClick={checkAnswer}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-2xl col-span-3"
            >
              回答する
            </button>
          </div>
          
          {feedback && (
            <div className={`text-2xl ${feedback.includes('正解') ? 'text-green-600' : 'text-red-600'}`}>
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdditionGame;