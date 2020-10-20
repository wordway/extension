export default [
  {
    key: 'youdao-web',
    name: '有道词典',
    icon: 'https://shared-https.ydstatic.com/images/favicon.ico',
    lookUpUrl: 'http://youdao.com/w/eng/',
    imageBigUrl: (url: string) => url,
  },
  {
    key: 'bing-web',
    name: '必应词典',
    icon: 'https://www.bing.com/sa/simg/favicon-etonb.ico',
    lookUpUrl: 'https://cn.bing.com/dict/search?q=',
    imageBigUrl: (url: string) => {
      return url.replace('&w=80&h=80', '');
    }
  },
  {
    key: 'cloudoptai',
    name: 'Cloudopt AI (Experimental)',
    icon: 'https://s.cloudopt.net/static/img/favicon.png',
    lookUpUrl: 'https://s.cloudopt.net/search?category=dict&q=',
    imageBigUrl: (url: string) => url,
  },
];
