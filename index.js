const cors = require('cors');
const path = require('path')
const express = require('express');
const auth = require('./routers/auth')
const app = express();
const setHeader = require('./middlewares/setHeader');
const {getPathDuties,postPathDuty, deletePathDuty} = require('./controllers/pathDuties')
const authenticate = require('./middlewares/authenticate')
const pathDutyReset = require('./controllers/pathDutiesReset')
const authorizeToDelete = require('./middlewares/authorizeToDelete')
const { Server } = require('socket.io');
const { createServer } = require('http');
const httpServer = createServer(app);
const io = new Server(httpServer, {
          cors: {
                    origin: '*',
                    credentials: true,
          },
});

app.use(cors(
          {
                    origin: '*',
                    credentials: 'true',
          },
));

io.on('connection', (socket) => {
          console.log(socket.id);
          socket.on('onBookAshtpadi',()=>socket.broadcast.emit('callFetchPathDuties'))
});

app.use(setHeader);
app.use(express.json());
app.use('/',(req,res)=>{
          res.send('hello')
})
app.use(express.static('frontend/build'));
app.use('/api/auth',auth);
app.get('/api/pathDuties',getPathDuties)
app.post('/api/pathDuties',authenticate,postPathDuty);
app.delete('/api/pathDuties',authenticate,authorizeToDelete,deletePathDuty)

app.get('*', (req, res) => {
          console.log('hello')
          res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

process.on('uncaughtException', (ex) => {
          console.log('We got uncaught exception', ex);
});
app.use((err, req, res, next) => {
          console.error(err);
          res.status(500).json({ message: `${err}` });
});
// if (process.env.NODE_ENV === 'production') {
//           app.use(express.static('buzz_fe/build'));
//           const path = require('path');
//           app.get('*', (req, res) => { res.sendFile(path.resolve(__dirname, 'buzz_fe', 'build', 'index.html')); });
// }
httpServer.listen(process.env.PORT || 5000, () => {console.log(`Listening on port ${process.env.PORT || 5000}...`)
require('./dbConnect');


});
