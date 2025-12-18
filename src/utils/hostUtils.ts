const ENV_SERVICE_HOST_MAP = {
  localhost: 'http://localhost:3000',
  // todo - fill in other envs
};

const getServiceUrl = () => {
  return ENV_SERVICE_HOST_MAP[window.location.hostname as keyof typeof ENV_SERVICE_HOST_MAP] || '';
};

export const API_BASE_URL = getServiceUrl();
