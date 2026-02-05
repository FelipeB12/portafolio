const { MongoClient, ObjectId } = require('mongodb');
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

        const db = client.db('test');
        const users = db.collection('users');

        rl.question('Enter the email OR the User ID (from logs) to promote to admin: ', async (rawInput) => {
            const input = rawInput.trim();
            let query = { email: input };

            // Check if input looks like a MongoDB ObjectId (24 hex characters)
            if (input.match(/^[0-9a-fA-F]{24}$/)) {
                try {
                    query = { _id: new ObjectId(input) };
                } catch (e) {
                    // Not a valid ObjectId format despite regex
                }
            }

            const user = await users.findOne(query);

            if (!user) {
                console.log(`\n❌ No user found with: ${input}`);
                console.log("Registered users in this DB:");
                const allUsers = await users.find({}).limit(10).toArray();
                if (allUsers.length === 0) {
                    console.log(" (The 'users' collection is currently empty)");
                } else {
                    allUsers.forEach(u => console.log(` - ID: ${u._id} | Email: ${u.email || 'N/A'} | Name: ${u.name}`));
                }
            } else {
                await users.updateOne(
                    { _id: user._id },
                    { $set: { role: 'admin' } }
                );
                console.log(`✅ Successfully promoted ${user.name || input} to admin!`);
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
