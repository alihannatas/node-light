import mongoose from "mongoose";


const conn = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: "lensligth",
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected  db succesfully");
    }).catch((err) => {
        console.log(~`Db connection error: ${err}`);
    })
}

export default conn;