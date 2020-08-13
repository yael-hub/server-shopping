import express from 'express';
import cors from 'cors';
import expressJwt from 'express-jwt';
import { connectDb } from './mongodb';
import { Musician } from './collections';
const PORT = 4000;

const { JWT_SECRET = 'secret' } = process.env;

const app = express();

app.use(express.json());
app.use(cors());
// comment out this line if you want to bypass JWT check during development
// app.use(expressJwt({ secret: JWT_SECRET }).unless({ path: '/' }));

app.get('/', (req, res) => {
    res.send('Hi there!');
});

app.get('/musicians', async (req, res) => {
    // find() returns a cursor, an object which we can use to control the query (such as adding limit/skip)
    // to finalize the query, we need to call cursor.exec(), which returns a promise of the actual query result
    // REMEMBER: the query is only executed when calling exec()
    const musicians = await Musician.find().exec();
    res.send(musicians);
});

app.get('/musicians/:id', async (req, res) => {
    const { id } = req.params;
    // with mongoose, there's no need to use new ObjectId(id)
    const musician = await Musician.findOne({ _id: id }).exec();
    res.send(musician);
});

app.post('/musicians', async (req, res) => {
    const { name, albums, members } = req.body;
    const newMusician = new Musician({
        name, albums, members
    });

    try {
        const { _id } = await newMusician.save();
        res.send({ id: _id });
    } catch (err) {
        return res.status(400).send({ validationErrors: err });
    }
});

app.delete('/musicians/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Musician.deleteOne({ _id: id });
        res.send('deleted');
    } catch (err) {
        return res.status(500).send({ err });
    }
});

startServer();

async function startServer() {
    await connectDb();
    app.listen(PORT, () => console.log(`Server is up at ${PORT}`));
}


