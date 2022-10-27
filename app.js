// 회원 정보 
const users = [
    {
      id: 1,
      name: "Rebekah Johnson",
      email: "Glover12345@gmail.com",
      password: "123qwe",
    },
    {
      id: 2,
      name: "Fabian Predovic",
      email: "Connell29@gmail.com",
      password: "password",
    },
  ];
  
  const posts = [
    {
      id: 1,
      title: "간단한 HTTP API 개발 시작!",
      content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
      userId: 1,
    },
    {
      id: 2,
      title: "HTTP의 특성",
      content: "Request/Response와 Stateless!!",
      userId: 1,
    },
  ];

// HTTP 모듈 불러오기
const http = require('http'); 

// HTTP 서버 객체 생성
const server = http.createServer();

// HTTP 요청(이벤트)이 발생하면 실행되는 listener(함수) 정의
const httpRequestListener = function (request, response) { 
    const {url, method} = request
      if (method === 'POST') {
        if (url === '/user/signup') {
          let body = '';

          request.on("data", (data) => {
            body += data;
          });

          request.on("end", ()=> {
            const user = JSON.parse(body);

            users.push({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
            });
            response.writeHead(200, {'Content-Type' : 'application/json'});
            response.end(JSON.stringify({"message" : "userCreated"}));
          });
        }
    }
};

            
  // http request가 발생하면 httpRequestListener가 실행될 수 있도록 
  // request 이벤트에 httpRequestListener(함수) 등록
  server.on("request", httpRequestListener); 
  
  const IP = '127.0.0.1'
  const PORT = 8000
  
  server.listen(PORT, IP, function() { 
      console.log(`Listening to requests on port ${PORT}`);
  });
  
  