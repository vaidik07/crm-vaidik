const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'crm_db'
};

let connection;
mysql.createConnection(dbConfig).then(conn => connection = conn);

function publishToQueue(queue, message) {
    amqp.connect('amqp://localhost', (err, conn) => {
        if (err) throw err;
        conn.createChannel((err, channel) => {
            if (err) throw err;
            channel.assertQueue(queue, { durable: true });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        });
    });
}

app.post('/api/customers', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).send('Invalid input');
    publishToQueue('customerQueue', req.body);
    res.status(202).send('Request received');
});

app.post('/api/orders', (req, res) => {
    const { customer_id, amount } = req.body;
    if (!customer_id || !amount) return res.status(400).send('Invalid input');
    publishToQueue('orderQueue', req.body);
    res.status(202).send('Request received');
});

app.listen(3000, () => console.log('Server running on port 3000'));
