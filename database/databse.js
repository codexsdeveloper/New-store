var mongoose = require('mongoose');

module.exports.Connect_DataBase = mongoose.connect( process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then( () =>{
    console.log('Connected To Server');
})
.catch((error) => {
    console.log('Database Error');
    console.log(error);
    process.exit(1)
})
