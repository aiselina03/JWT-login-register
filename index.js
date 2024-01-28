import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

app.use(express.json());
app.use(cors());
const app = express();
const port = 3000;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
});
const usersModel = mongoose.model("usersModel", userSchema);

app.get("/", async (req, res) => {
  try {
    const user = await usersModel.find({});
    res.json(user);
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersModel.findById(id);
    res.json(user);
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const newuser = new usersModel({ email, password, role });
    await newuser.save();
    res.json(newuser);
  } catch (error) {
    res.send(error.message);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersModel.findByIdAndDelete(id);
    res.json(user);
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hash = bcrypt.hashSync( password, 12);
        const newuser = new usersModel({ email, password:hash })
        var token = jwt.sign({email: newuser.email, role: newuser.role}, 'ryg4575uk-=' ,{ expiresIn: '1h' });
        await newuser.save();
        res.json(token);
      } catch (error) {
        res.send(error.message);
      }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usersModel.findOne({ email });
        if (!user) {
            res.send("user not found")
            return
        }
        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            res.send("password not valid")
            return
        }

        const token = jwt.sign({email: user.email, role: user.role}, 'ryg4575uk-=' ,{ expiresIn: '1h' });
        res.json(token);

      } catch (error) {
        res.send(error.message);
      }
});

mongoose
  .connect("mongodb+srv://Aysel:tahirova2003@mycluster.dg6gk9i.mongodb.net/")
  .then(() => console.log("Connected!"))
  .catch(() => console.log(" not Connected!"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
