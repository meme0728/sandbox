import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';

const AdditionGame = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTime, setSelectedTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [scoreHistory, setScoreHistory] = useState([]);
  // 難易度レベルを保持する状態変数を追加
  const [level, setLevel] = useState('ふつう');

  // use-soundフックを使用して効果音を定義
  // const [playCorrect] = useSound('./tree/main/public/maru_short.mp3', { volume: 0.7 });
  // const [playIncorrect] = useSound('./tree/main/public/beep.mp3', { volume: 0.7 });
  const [playCorrect] = useSound('https://github.com/meme0728/sandbox/blob/3983584bad7080ca5ddbf5d75742505e3bb28070/public/maru_short.mp3', { volume: 0.7 });
  const [playIncorrect] = useSound('https://github.com/meme0728/sandbox/blob/3983584bad7080ca5ddbf5d75742505e3bb28070/public/beep.mp3', { volume: 0.7 });

  // レベルごとの数値の上限を定義
  const levelLimits = {
    'かんたん': 5,
    'ふつう': 10,
    'むずかしい': 20
  };

  // 新しい問題を生成する関数（難易度に応じて数値範囲を変更）
  const generateNewQuestion = () => {
    // 現在の難易度に基づいて上限値を取得
    const maxNum = levelLimits[level];
    setNum1(Math.floor(Math.random() * maxNum) + 1);
    setNum2(Math.floor(Math.random() * maxNum) + 1);
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

  // 効果音を再生する関数（use-soundを使用）
  const playSound = (isCorrect) => {
    try {
      if (isCorrect) {
        // 正解の場合
        playCorrect();
      } else {
        // 不正解の場合
        playIncorrect();
      }
    } catch (error) {
      console.error('効果音の再生中にエラーが発生しました:', error);
    }
  };

  // 答えを確認する関数
  const checkAnswer = () => {
    const correctAnswer = num1 + num2;
    const userAnswerNum = parseInt(userAnswer, 10);

    if (userAnswerNum === correctAnswer) {
      setFeedback('正解！👍');
      setScore(score + 1);
      playSound(true); // 正解音を再生
      generateNewQuestion();
    } else {
      setFeedback(`不正解です。正解は ${correctAnswer} でした。`);
      playSound(false); // 不正解音を再生
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
    } else if (timeLeft === 0 && gameActive) {
      // gameActiveがtrueの場合のみ終了処理を実行
      setGameActive(false);
      setFeedback(`ゲーム終了！あなたのスコアは ${score} 点です！`);
      // スコア履歴を更新（難易度情報を追加）
      setScoreHistory(prevHistory => [...prevHistory, {
        回数: prevHistory.length + 1,
        スコア: score,
        制限時間: selectedTime === 30 ? '30秒' : '1分',
        難易度: level
      }]);
      // タイマー表示をリセット
      setShowTimer(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, score, selectedTime, level]);

  return (
    <div className="flex flex-col items-center justify-center min-h-64 bg-gray-100 p-8 rounded-lg shadow-md">
      {!gameStarted ? (
        <div className="text-center w-full">
          <h1 className="text-5xl font-bold mb-6 text-blue-600">たしざんゲーム</h1>
          <p className="text-2xl mb-6">制限時間内で何問解けるかな？</p>
          
          {/* 難易度選択ボタンを追加 */}
          <div className="mb-8">
            <p className="text-xl mb-4 font-bold">むずかしさ：</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setLevel('かんたん')}
                className={`px-6 py-3 rounded-lg text-xl font-bold ${
                  level === 'かんたん' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                かんたん (〜5)
              </button>
              <button 
                onClick={() => setLevel('ふつう')}
                className={`px-6 py-3 rounded-lg text-xl font-bold ${
                  level === 'ふつう' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                ふつう (〜10)
              </button>
              <button 
                onClick={() => setLevel('むずかしい')}
                className={`px-6 py-3 rounded-lg text-xl font-bold ${
                  level === 'むずかしい' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                むずかしい (〜20)
              </button>
            </div>
          </div>
          
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
            スタート！
          </button>
          
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
              setLevel('ふつう'); // 難易度もリセット
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl"
          >
            もう一度プレイ
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex justify-between w-full mb-6">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xl p-2">
              スコア: {score}
            </div>
            <div className="bg-purple-500 text-white px-4 py-2 rounded-lg text-xl p-2">
              難易度: {level}
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