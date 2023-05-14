import React, { useState, useEffect } from 'react';
import './Game.css';
import { Number } from './Number';
import { v4 as uuidv4 } from 'uuid';

type Data = { id: string; row: number; col: number; value: number };

export const Game = ({
  onScoreChange,
}: {
  onScoreChange: (score: number) => void;
}) => {
  const [datas, setDatas] = useState<Data[]>([]);
  const [keyDown, setKeyDown] = useState<
    'top' | 'down' | 'left' | 'right' | ''
  >('');
  let moving = false;

  function start() {
    setDatas([]);
    onScoreChange(-1);
    const set = new Set<string>();
    while (set.size < 2) {
      const row = random();
      const col = random();
      const key = row + '-' + col;
      if (!set.has(key)) {
        set.add(key);
        setDatas((prev) => [...prev, { id: uuidv4(), row, col, value: 2 }]);
      }
    }
  }

  function random(num = 4) {
    return Math.floor(Math.random() * num);
  }

  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setKeyDown('top');
        break;
      case 'ArrowDown':
        setKeyDown('down');
        break;
      case 'ArrowLeft':
        setKeyDown('left');
        break;
      case 'ArrowRight':
        setKeyDown('right');
        break;
    }
  };

  function move(direction: 'top' | 'down' | 'left' | 'right' | '') {
    if (direction === '' || moving) return;

    moving = true;
    let score = 0;
    let moved = false;
    // 移動
    const remove: string[] = [];
    const merge: string[] = [];
    for (let i = 0; i < 4; i++) {
      let col = ['left', 'top'].includes(direction) ? 0 : 3;
      let dir = ['left', 'top'].includes(direction) ? 1 : -1;
      const key = ['left', 'right'].includes(direction) ? 'col' : 'row';

      const rows = datas
        .filter(({ col, row }) =>
          ['left', 'right'].includes(direction) ? row === i : col === i
        )
        .sort((a, b) =>
          ['left', 'top'].includes(direction)
            ? a[key] < b[key]
              ? -1
              : 1
            : a[key] < b[key]
            ? 1
            : -1
        );

      for (let j = 0; j < rows.length; j++) {
        if (
          j !== 0 &&
          !merge.includes(rows[j - 1].id) &&
          rows[j - 1].value === rows[j].value
        ) {
          rows[j][key] = col - dir;
          merge.push(rows[j].id);
          remove.push(rows[j - 1].id);
          score += rows[j].value * 2;
          moved = true;
          continue;
        }
        if (rows[j][key] !== col) {
          rows[j][key] = col;
          moved = true;
        }
        col += dir;
      }
    }
    if (!moved) return;
    setDatas((prev) => [...prev]);
    setTimeout(() => {
      setDatas((prev) =>
        prev
          .filter(({ id }) => !remove.includes(id))
          .map((data) => {
            if (merge.includes(data.id)) {
              data.value *= 2;
            }
            return data;
          })
      );
      // 計算遊戲結果
      onScoreChange(score);
      const allGrids = Array.from({ length: 16 }, (_, i) => [
        Math.floor(i / 4),
        i % 4,
      ]);
      const emptys = allGrids.filter(
        ([row, col]) =>
          !datas.find(({ row: r, col: c }) => r === row && c === col)
      );

      if (emptys.length === 0) {
        console.log('you loss');
        return;
      }

      // 新增數字
      const [row, col] = emptys[random(emptys.length)];
      setDatas((prev) => [...prev, { id: uuidv4(), row, col, value: 2 }]);
      setKeyDown('');
      moving = false;
    }, 200);
  }

  useEffect(() => {
    console.log('init');
    start();
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    console.log('datas change', datas);
  }, [datas]);

  useEffect(() => {
    move(keyDown);
  }, [keyDown]);

  return (
    <>
      <div className="above-game">
        <button onClick={start}>Restart</button>
      </div>
      <div className="game-container">
        <div className="grid-container">
          {Array(16)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="grid"></div>
            ))}
        </div>
        <div className="number-container">
          {datas.map(({ id, row, col, value }) => (
            <Number key={id} value={value} row={row} col={col} />
          ))}
        </div>
      </div>
    </>
  );
};
