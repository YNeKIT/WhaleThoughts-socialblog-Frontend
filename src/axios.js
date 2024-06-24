import axios  from 'axios';


const instance = axios.create({
    baseURL :  process.env.REACT_APP_API_URL   || 
    "https://whale-thoughts-socialblog-frontend.vercel.app" ,
});

instance.interceptors.request.use((config)  => {
    config.headers.Authorization = window.localStorage.getItem('token');
    return config ;
}  )

export default instance;

