import React, { useEffect, useState } from 'react';

export const Number = ({
  value,
  row,
  col,
}: {
  value: number;
  row: number;
  col: number;
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const style = {
    transform: `translate(calc((100% + ${
      windowWidth < 520 ? '10px' : '15px'
    }) * ${col}), calc((100% + ${
      windowWidth < 520 ? '10px' : '15px'
    }) * ${row}))`,
  };
  return (
    <div className={'number no-' + value} style={style}>
      {value}
    </div>
  );
};
