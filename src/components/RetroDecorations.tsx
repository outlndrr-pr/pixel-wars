import React from 'react';

type StarProps = {
  size?: number;
  top: number;
  left: number;
  className?: string;
};

export const RetroStar: React.FC<StarProps> = ({
  size = 20,
  top,
  left,
  className = '',
}) => {
  return (
    <div
      className={`retro-star ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}px`,
        left: `${left}px`,
      }}
    />
  );
};

type CloudProps = {
  width?: number;
  height?: number;
  top: number;
  left: number;
  className?: string;
};

export const RetroCloud: React.FC<CloudProps> = ({
  width = 60,
  height = 30,
  top,
  left,
  className = '',
}) => {
  return (
    <div
      className={`retro-cloud ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      }}
    />
  );
};

type MoonProps = {
  size?: number;
  top: number;
  left: number;
  className?: string;
};

export const RetroMoon: React.FC<MoonProps> = ({
  size = 40,
  top,
  left,
  className = '',
}) => {
  return (
    <div
      className={`retro-moon ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}px`,
        left: `${left}px`,
      }}
    />
  );
};

type DecorationsProps = {
  className?: string;
};

const RetroDecorations: React.FC<DecorationsProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <RetroStar top={50} left={100} size={15} />
      <RetroStar top={150} left={400} size={20} />
      <RetroStar top={300} left={200} size={25} />
      <RetroStar top={80} left={500} size={15} />
      <RetroStar top={250} left={600} size={18} />
      
      <RetroCloud top={400} left={100} width={70} height={35} />
      <RetroCloud top={350} left={500} width={60} height={30} />
      
      <RetroMoon top={50} left={600} size={50} />
    </div>
  );
};

export default RetroDecorations; 