const http = require('http');

function check(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

async function run() {
  const r1 = await check('http://localhost:5173/');
  console.log(r1);
  const r2 = await check('http://localhost:5000/api/health');
  console.log(r2);
}

run();
