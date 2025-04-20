import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ConsoleFallbacker } from './console-fallbacker';

export const ConsoleNavigator: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/console') }, [navigate]);

  return (
    <div>
      <ConsoleFallbacker />
    </div>
  )
}
