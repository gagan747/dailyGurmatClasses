let hostUrl;
export default hostUrl = (process.env.REACT_APP_STAGE === 'development') ? ('http://localhost:5000') : 'https://dailygurmatclasses.onrender.com';
