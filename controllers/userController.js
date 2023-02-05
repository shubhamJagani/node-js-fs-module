const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

exports.getAllUser = async (req, res, next) => {
  try {
    const data = await readfile("./user.json", "utf8");
    const jsonParse = JSON.parse(data);

    return res.status(200).json({
      success: true,
      result: jsonParse,
      message: "users get successfully..! ",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const { userName, age, birthDate, gender, email } = req.body;

    const hashPW = await bcrypt.hash(req.body.password, 12);

    const newUser = {
      userName,
      age,
      birthDate,
      gender,
      email,
      password: hashPW,
    };

    const filePath = path.join(__dirname, "../user.json");

    const response = await readfile(filePath, "utf8");

    let users = []

    if(response) {
     users = JSON.parse(response);
    }


    // let lastUser ;

    // if(response1 === '[]'){
    //   lastUser.id = 0
    // }
    let newID ;

    const lastUser = users.at(-1);

    if (!lastUser) {
      newID = 1;
    } else {
      const lastUserID = lastUser.id;

      newID = +lastUserID + 1;
    }

    newUser.id = String(newID);

    users.push(newUser);

    const stringFyUser = JSON.stringify(users);

    await writeFile("./user.json", stringFyUser);

    return res.status(200).json({
      success: true,
      result: newUser,
      message: "user Add successfully..! ",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await readfile("./user.json", "utf8");

    const users = JSON.parse(data);

    const user = await users.find((elm) => elm.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      result: user,
      message: "user get successfully..! ",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await readfile("./user.json", "utf8");

    const parseUser = JSON.parse(data);

    const user = parseUser.find((elm) => elm.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const indexofUser = parseUser.findIndex((elm) => elm.id === id);

    const newUser = {
      id: user.id,
      userName: req.body.userName,
      age: req.body.age,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      email: req.body.email,
    };

    parseUser.splice(indexofUser, 1, newUser);

    const stringifyUser = JSON.stringify(parseUser);

    await writeFile("./user.json", stringifyUser);

    return res.status(200).json({
      success: true,
      result: newUser,
      message: "user updated successfully..! ",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await readfile("./user.json", "utf8");

    const parseUser = JSON.parse(data);

    const user = parseUser.find((elm) => elm.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const findIndex = await parseUser.findIndex((elm) => elm.id === id);

    parseUser.splice(findIndex, 1);

    const strinFy = JSON.stringify(parseUser);

    await writeFile("./user.json", strinFy);

    return res.status(200).json({
      success: true,
      result: user,
      message: "user deleted successfully..! ",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const readfile = (path, type) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, type, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const writeFile = (path, type) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, type, (err, data) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
