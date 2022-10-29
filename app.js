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
  }
];

// 게시글 정보 
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
  }
];

// 게시판 글 정보 
function getPostsList (users,posts) {
  const info = [];

  users.forEach((element) => {
    const obj = {};
    obj["userID"] = element.id;
    obj["userName"] = element.name;

    for (j in posts) {
      if (element.id === posts[j].id) {
        obj["postingID"] = posts[j].id;
        obj["postingTitle"] = posts[j].title;
        obj["postingContent"] = posts[j].content;
      }
    }
    info.push(obj);
  })
  return info; 
};


// 1. HTTP 모듈 불러오기
const http = require("http");

// 2. HTTP 서버 객체 생성
const server = http.createServer();

//3. HTTP 요청(이벤트)이 발생하면 실행되는 listener(함수) 정의
const httpRequestListener = function (request, response) {
  const { url, method } = request;

  if (method === "GET") {
    if (url === "/posts") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ data: getPostsList(users,posts) }));
    }
  } 

 
  if (method === "POST") {
     // 회원가입
    if (url === "/users/signup") {
      let body = "";

      request.on("data", (data) => { body += data});
      request.on("end", () => {
        const user = JSON.parse(body);

        // 사용자 정보 입력 
        users.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "userCreated" }));
      });
    } 
      
    // 게시물 생성 
    if (url === "/posts") {
      let body = "";

      request.on("data", (data) => { body += data;});
      request.on("end", () => {
        const post = JSON.parse(body);
        const user = users.find((user) => user.id === post.userId);
      
      if(user) {
        posts.push({
          id: post.id,
          title: post.title,
          content: post.content,
          img : post.img,
          userId: post.userId,
        });

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ "message": "PostCreated" }));
      } else {
        response.writeHead(404, { "Content-Type": "application/json"});
        response.end(JSON.stringify({ "message": "USER DOSE NOT EXISTS!!!"}));
      }
      });
    }
  }

  if (method === "PATCH") {
    if(url.startsWith("/posts")) {
      let body = "";

      request.on("data", (data) => {body += data;});
      request.on("end", () => {
        const postId = parseInt(url.split("/")[2]);
        const data = JSON.parse(body)
        const post = posts.find((post) => post.id === postId);

        post.title = data.title;
        post.content = data.content;

        response.writeHead(200, {"Content-Type" : "application/json"});
        response.end(JSON.stringify({ post : post }))
      }
    )};
  }

  if (method === "DELETE") {
    // 게시물 삭제 
    if(url.startsWith("/posts")) {
      const postId = parseInt(url.split("/")[2]);
      const indexOfPostId = posts.findIndex((post) => post.id === postId);

      post.splice(indexOfPostId, 1)

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ post: post }));
    }
  }
};


// http request가 발생하면 httpRequestListener가 실행될 수 있도록
// request 이벤트에 httpRequestListener(함수) 등록
server.on("request", httpRequestListener);

const PORT = 8000;
const IP = "127.0.0.1";

server.listen(PORT, IP, function() {
  console.log(`Listening to requests on port ${PORT}`);
});
