const { v2: cloudinary } = require('cloudinary');

// Explicit configuration
cloudinary.config({
    cloud_name: 'ditogxt9n',
    api_key: '395596515867167',
    api_secret: 'Wb89Bly6YvI-2V5_1M061u7Jv3o',
    secure: true
});

async function run() {
    const publicId = 'cvs/ct6nyf2x2g69pmzndxxd';
    console.log(`Checking resource: ${publicId}`);

    try {
        const resource = await cloudinary.api.resource(publicId, {
            resource_type: 'image'
        });
        console.log('Resource Details:');
        console.log(JSON.stringify(resource, null, 2));

        // Test URL generation with the actual resource data
        console.log('\nTesting URL generation:');

        const url1 = cloudinary.url(publicId, {
            sign_url: true,
            secure: true,
            resource_type: 'image',
            analytics: false
        });
        console.log(`Signed URL (image, no analytics): ${url1}`);

        const url2 = cloudinary.url(publicId, {
            sign_url: true,
            secure: true,
            resource_type: 'image',
            version: resource.version,
            analytics: false
        });
        console.log(`Signed URL (image + version, no analytics): ${url2}`);

        const url3 = cloudinary.url(`${publicId}.${resource.format}`, {
            sign_url: true,
            secure: true,
            resource_type: 'image',
            version: resource.version,
            analytics: false
        });
        console.log(`Signed URL (image + publicId.format + version, no analytics): ${url3}`);

    } catch (error) {
        console.error('Error fetching resource details:', error);

        if (error.http_code === 404) {
            console.log('Resource not found as image. Trying raw...');
            try {
                const resource = await cloudinary.api.resource(publicId, {
                    resource_type: 'raw'
                });
                console.log('Resource Details (raw):');
                console.log(JSON.stringify(resource, null, 2));
            } catch (rawError) {
                console.error('Error fetching resource as raw:', rawError);
            }
        }
    }
}

run();
