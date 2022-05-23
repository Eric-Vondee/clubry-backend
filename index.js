const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const createError = require('http-errors');
const dotenv = require('dotenv');
dotenv.config()


const corsConfig= {
    origin:process.env.NODE_ENV === 'production' ? ['http://localhost:3000/', 'http://localhost:3000']: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true

}
const PORT = process.env.PORT || 3050;

app.use(cors(corsConfig));
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());


app.use('/ipfs', require('./src/ipfs'));

//Catch 404 and forard to error handler 
app.use((req,res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
	// render the error page
	res.status(err.status || 500);
	res.send({
		status: 'ERROR',
		message: err.message,
		payload: { ...err }
	});
});




app.listen(PORT, () => console.log(`Clubry backend server started on port http://0.0.0.0.:${PORT}`))