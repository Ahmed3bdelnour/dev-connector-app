const express = require('express');
const app = express();
const connectDB = require('./config/db');

const usersRouter = require('./routes/api/users');
const postsRouter = require('./routes/api/posts');
const profileRouter = require('./routes/api/profile');
const authRouter = require('./routes/api/auth');

//connect DB
connectDB();

//init request body parser middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('app is running now');
});

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  {
    console.log(`app is listening on port ${PORT}`);
  }
});
