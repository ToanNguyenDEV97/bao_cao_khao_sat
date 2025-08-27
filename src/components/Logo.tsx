import React from 'react';

const Logo: React.FC = () => (
  <div className="border border-black" style={{ width: '120px', height: '40px' }}>
      <div className="flex items-center h-full">
          <div className="h-full w-1.5 bg-black ml-1"></div>
          <div className="ml-2 text-center">
              <div className="font-bold text-lg" style={{ color: '#007A33' }}>IIG</div>
              <div className="font-semibold text-xs tracking-wider">VIET NAM</div>
          </div>
      </div>
  </div>
);

export default Logo;