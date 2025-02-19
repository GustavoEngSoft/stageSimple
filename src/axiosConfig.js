import axios from 'axios';

// Configuração global do axios para incluir cookies nas solicitações
axios.defaults.withCredentials = true;

export default axios;