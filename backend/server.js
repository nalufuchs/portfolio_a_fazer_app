const cors = require("cors");
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: './database.sqlite'
})
var db = {}


// CRIAÇÃO DO DATABASE PARA ARMAZENAMENTO DO 'A FAZER'
async function setupDB() {
    try {
        db.Task = sequelize.define('Task', {
            text: {
                type: DataTypes.STRING,
                allowNull: false
            },
        });
        await sequelize.sync({ force: true });
        await db.Task.create({ text: "Item-1-Ana Banana"});
        await db.Task.create({ text: "Item-2 - Olá, mundo"});
        await db.Task.create({ text: "Item-3 - Bruno Mars"});
    } catch (error) {
        console.error(error);
    }
}



// FUNÇÃO PARA CRIAR APIs URL ENDPOINTS PARA CRIAR E DELETAR TAREFAS
async function startServer() {
    try {
        await setupDB()
        const port = 3001
        const express = require('express')
        const app = express();

        var corsOptions = {
            origin: "http://localhost:5173"
          };
          
        app.use(cors(corsOptions));
        app.use(express.json())
        app.get('/', (req, res) => {
            res.send('hello world')
        })



        // OBTER A API URL DO METODO | RECUPERAR ITENS
        app.get('/api/tasks', (req, res) => {
            // return all taskls
            db.Task.findAll().then(tasks => {
                res.json(tasks)
            })
        })
        // MÉTODO POST PARA A API URL | CRIAR ITENS
        app.post('/api/tasks', (req, res) => {
            // create a task
            console.log('entrou');
            db.Task.create(req.body).then( t => {
                res.json(t)
            }) 
        })



        // O METODO DELETE  API URL | DELETAR ITENS
        app.delete('/api/tasks/:id', (req, res) => {
            // delete a task
            db.Task.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.sendStatus(204);
            }).catch((error) => {
                console.error(error);
                res.sendStatus(500); // Caso dê Internal Server Error
            });
        });


        app.listen(port, () => {
            console.log(`App listening on port ${port}`) 
        })
    } catch (error) {
        console.error(error);
    }
}
startServer()