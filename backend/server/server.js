const app = require('./index.js');

const PORT = process.env.PORT || 30001;

app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`);
});