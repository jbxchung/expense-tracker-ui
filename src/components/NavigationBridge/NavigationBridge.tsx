import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerNavigate } from 'utils/fetchUtils';

// component to register the fetchUtils' navigation with the actual useNavigate hook
const NavigationBridge = () => {
  const navigate = useNavigate();

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate]);

  return null;
};

export default NavigationBridge;
