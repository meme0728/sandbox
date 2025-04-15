import React, { useState, useEffect } from 'react';

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

  // 新しい問題を生成する関数
  const generateNewQuestion = () => {
    setNum1(Math.floor(Math.random() * 20) + 1);
    setNum2(Math.floor(Math.random() * 20) + 1);
    setUserAnswer('');
    setFeedback('');
  };

  // ゲームを開始する関数
  const startGame = () => {
    setGameActive(true);
    setGameStarted(true);
    setScore(0);
    setTimeLeft(selectedTime);
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
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      setFeedback(`ゲーム終了！あなたのスコアは ${score} 点です！`);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, score]);

  return (
    <div className="flex flex-col items-center justify-center min-h-64 bg-gray-100 p-6 rounded-lg shadow-md">
      {!gameStarted ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-blue-600">足し算ゲーム</h1>
          <p className="mb-4">制限時間内で何問解けるかな？</p>
          
          <div className="mb-6">
            <p className="mb-2 font-bold">制限時間を選択：</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setSelectedTime(30)}
                className={`px-4 py-2 rounded font-bold ${
                  selectedTime === 30 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                30秒
              </button>
              <button 
                onClick={() => setSelectedTime(60)}
                className={`px-4 py-2 rounded font-bold ${
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
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            ゲームスタート
          </button>
        </div>
      ) : !gameActive ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-blue-600">ゲーム終了</h1>
          <p className="text-xl mb-4">{feedback}</p>
          <button 
            onClick={() => {
              setGameStarted(false);
              setSelectedTime(30);
              setTimeLeft(30);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            もう一度プレイ
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex justify-between w-full mb-4">
            <div className="bg-blue-500 text-white px-3 py-1 rounded">
              スコア: {score}
            </div>
            <div className="bg-red-500 text-white px-3 py-1 rounded">
              残り時間: {timeLeft}秒
            </div>
          </div>
          
          <div className="text-2xl mb-4">
            {num1} + {num2} = ?
          </div>
          
          <div className="mb-4">
            <input 
              type="text" 
              value={userAnswer} 
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-2 border-gray-300 rounded px-4 py-2 w-32 text-center text-xl"
              autoFocus
              readOnly
            />
          </div>
          
          {/* 数字ボタン */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button 
                key={num} 
                onClick={() => handleNumberClick(num.toString())}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded text-xl"
              >
                {num}
              </button>
            ))}
            <button 
              onClick={handleClear}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded text-xl col-span-2"
            >
              クリア
            </button>
            <button 
              onClick={checkAnswer}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded text-xl col-span-3"
            >
              回答する
            </button>
          </div>
          
          {feedback && (
            <div className={`text-lg ${feedback.includes('正解') ? 'text-green-600' : 'text-red-600'}`}>
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdditionGame;