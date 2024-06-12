const amqp = require('amqplib/callback_api');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'crm_db'
};

async function processQueue(queue, processFunction) {
    amqp.connect('amqp://localhost', (err, conn) => {
        if (err) throw err;
        conn.createChannel((err, channel) => {
            if (err) throw err;
            channel.assertQueue(queue, { durable: true });
            channel.consume(queue, async (msg) => {
                const data = JSON.parse(msg.content.toString());
                await processFunction(data);
                channel.ack(msg);
            }, { noAck: false });
        });
    });
}

async function processCustomer(data) {
    const connection = await mysql.createConnection(dbConfig);
    const { name, email } = data;
    await connection.query('INSERT INTO customers (name, email) VALUES (?, ?)', [name, email]);
    await connection.end();
}

async function processOrder(data) {
    const connection = await mysql.createConnection(dbConfig);
    const { customer_id, amount } = data;
    await connection.query('INSERT INTO orders (customer_id, amount) VALUES (?, ?)', [customer_id, amount]);
    await connection.end();
}

processQueue('customerQueue', processCustomer);
processQueue('orderQueue', processOrder);
