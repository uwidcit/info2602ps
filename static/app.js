const tabs = M.Tabs.init(document.querySelector('.tabs'));

function logout(){
  window.localStorage.removeItem('access_token');
  window.location.href ="index.html";
}