const { MongoClient } = require('mongodb');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const uri = "mongodb+srv://felipeb12:aroU4gXOhXRmvWID@cluster0.qalexb1.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function promote() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db('portafolio'); // Ensure this matches your DB name
        const users = db.collection('users');

        rl.question('Enter the email of the user to promote to admin: ', async (email) => {
            const result = await users.updateOne(
                { email: email },
                { $set: { role: 'admin' } }
            );

            if (result.matchedCount === 0) {
                console.log(`No user found with email: ${email}`);
            } else {
                console.log(`Successfully promoted ${email} to admin!`);
            }

            await client.close();
            rl.close();
        });

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

promote();
