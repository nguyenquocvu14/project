import { parse } from "dotenv";
import pool from "../configs/connectDB";
import multer from "multer";

let getHomepage = async (req, res) => {
  //logic
  const [rows, fields] = await pool.execute("SELECT * FROM users");
  // console.log(rows[0]);
  return res.render("index.ejs", { dataUser: rows });
};
//xem chi tiet user
let getDetailpage = async (req, res) => {
  let userId = req.params.id;
  let [user] = await pool.execute("SELECT * FROM users Where id=?", [userId]);
  // console.log("check", user);
  return res.send(JSON.stringify(user));
};
//them du lieu database
let createNewUser = async (req, res) => {
  // console.log("check", req.body);
  let { firstname, lastname, email, address } = req.body;
  await pool.execute("insert into users (firstname, lastname, email, address) values(?, ?, ?, ?)", [firstname, lastname, email, address]);
  // return res.send("insert into users ");
  return res.redirect("/");
};
//xoa user
let deleteUser = async (req, res) => {
  let userId = req.body.userId;
  await pool.execute("delete from users where id =?", [userId]);

  return res.redirect("/");
};
//sua user
let getEditpage = async (req, res) => {
  let id = req.params.id;
  let [user] = await pool.execute("SELECT * FROM users Where id=?", [id]);
  return res.render("Update.ejs", { dataUser: user });
};
//sua user
let getUpdate = async (req, res) => {
  let { firstname, id, lastname, email, address } = req.body;
  await pool.execute("update users set firstname = ? , lastname = ? ,email = ? , address = ? where id = ? ", [firstname, lastname, email, address, id]);

  return res.redirect("/");
};
//
let getUploadFilepage = async (req, res) => {
  return res.render("UploadFile.ejs");
};
//
//kiem tra duoi file

const upload = multer().single("profile_pic");
let handleUploadFile = async (req, res) => {
  // 'profile_pic' is the name of our file input field in the HTML form

  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }
    // Display uploaded image for user validation
    res.send(`You have uploaded this image: <hr/><img src="/image/${req.file.filename}" width="500"><hr /><a href="/uploadfile">Upload another image</a>`);
  });
  // return res.send("hello word");
};
//

//

module.exports = {
  getHomepage,
  getDetailpage,
  createNewUser,
  deleteUser,
  getEditpage,
  getUpdate,
  getUploadFilepage,
  handleUploadFile,
};
