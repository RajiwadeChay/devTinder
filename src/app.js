const express = require("express");

const app = express();
// "ab?c" => b is optional => /abc, /ac
// "ab+c" => one or more char b => /abc, /abbc, /abbbc
// "ab*cd" => * can contain anything => /abcd, /abercd
// "a(bc)+" => can conatin one or more bc => /abc, /abcbcbc
// /a/ => must have a => /a, /aaa
app.get("/user/:userId/:name/:password", (req, res) => {
  // console.log(req.query); // Getting query params
  console.log(req.params); // Getting dynamic params
  res.send("Query params and dynamic routing!");
});

// // This will only handle GET call to /user
// app.get("/user", (req, res) => {
//   res.send({ firstName: "Chay", lastName: "Rajiwade" });
// });

// // This will only handle POST call to /user
// app.post("/user", (req, res) => {
//   // Saving data to DB
//   res.send("Data successfully saved to the database!");
// });

// // This will only handle PUT call to /user
// app.put("/user", (req, res) => {
//   res.send("Data successfully updated!");
// });

// // This will only handle PATCH call to /user
// app.patch("/user", (req, res) => {
//   res.send("Partial data successfully updated!");
// });

// // This will only handle DELETE call to /user
// app.delete("/user", (req, res) => {
//   res.send("Deleted successfully!");
// });

// // This will match all the HTTP method API calls to /test
// app.use("/test", (req, res) => {
//   res.send("Hello Test!");
// });

// app.use("/hello/2", (req, res) => {
//   res.send("Hello Hello 2!");
// });

// app.use("/hello", (req, res) => {
//   res.send("Hello Hello!");
// });

app.use("/", (req, res) => {
  res.send("Hello Dashboard!");
});

app.listen(7777, () => {
  console.log("Server is listening to port 7777!");
});
