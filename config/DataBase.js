const mongoose = require('mongoose');

const DataBase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("DtaBase is successfully connected sir");
    } catch (error) {
        console.log("DtaBase is not connected sir");
    }
}
module.exports=DataBase