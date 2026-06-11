import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3333/api/v1', 
    headers: {Authorization: 'Bearer oat_MTI.cHRtZGlZOTVnTnJZcjA0MWJXcVE2ZTZNV29tTFhLbHB6dnZncFBBYjM2NDAzMDQzMDI'}
})

export default api;