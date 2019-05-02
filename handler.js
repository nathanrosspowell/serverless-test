'use strict';

var qs = require('qs')

module.exports.homepage = (event, context, callback) => {
  let dynamicHtml = '<p>Hey Unknown!</p>';
  // check for GET params and use if available
  if (event.queryStringParameters && event.queryStringParameters.name) {
    dynamicHtml = `<p>Hey ${event.queryStringParameters.name}!</p>`;
  }

  const html = `
  <html>
    <style>
      h1 { color: #73757d; }
    </style>
    <body>
      <h1>Landing Page</h1>
      ${dynamicHtml}
    </body>
  </html>`;

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  };

  // callback is sending HTML back
  callback(null, response);
};

module.exports.contact = (event, context, callback) => {

  console.log('Received event:', JSON.stringify(event, null, 2));

  var data = qs.parse(event.body);

  if (data.a === undefined || data.b === undefined || data.op === undefined) {
      const response = {
        statusCode: 400,
        headers: {
          "x-custom-header" : "Contact Form Reply"
        },
        body: JSON.stringify({ status: "Missing paramteres `a`:(" + data.a + "), `b`:(" + data.b + "), `op`:(" + data.op + ")." })
      };
      callback(null, response);
      return;
  }

  
  var res = {};
  res.a = Number(data.a);
  res.b = Number(data.b);
  res.op = data.op;
  
  if (isNaN(data.a) || isNaN(data.b)) {
      const response = {
        statusCode: 400,
        headers: {
          "x-custom-header" : "Contact Form Reply"
        },
        body: JSON.stringify({ status: "One of more values are NaN." })
      };
      callback(null, response);
      return;
  }

  switch(data.op)
  {
      case "+":
      case "add":
          res.c = res.a + res.b;
          break;
      case "-":
      case "sub":
          res.c = res.a - res.b;
          break;
      case "*":
      case "mul":
          res.c = res.a * res.b;
          break;
      case "/":
      case "div":
          res.c = res.b===0 ? NaN : Number(data.a) / Number(data.b);
          break;
      default:
        const response = {
          statusCode: 400,
          headers: {
            "x-custom-header" : "Contact Form Reply"
          },
          body: JSON.stringify({ status: "Invalid operator." })
        };
        callback(null, response);
        return;
  }

  const response = {
    statusCode: 200,
    headers: {
      "x-custom-header" : "Contact Form Reply"
    },
    body: JSON.stringify({ status: 'OK', calculation: res }),
  };
  callback(null, response);
};
