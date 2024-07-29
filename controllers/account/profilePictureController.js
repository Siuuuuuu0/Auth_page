const AWS = require('aws-sdk');
const uuid = require('uuid');

const s3 = new AWS.S3({
    endpoint: 'https://storage.yandexcloud.net',
    region: 'ru-central1',
    accessKeyId: process.env.YANDEX_ACCESS_KEY,
    secretAccessKey: process.env.YANDEX_SECRET_KEY,
});

const handleProfilePictureChange = async (req, res) => {
    try {
        if (req.file) {
            const fileContent = req.file.buffer;
            const fileName = `${uuid.v4()}-${req.file.originalname}`;
            const userId = req.body.id;

            const params = {
                Bucket: process.env.YANDEX_BUCKET_NAME,
                Key: fileName,
                Body: fileContent,
                Metadata: {
                    userId: userId
                },
                ContentType: req.file.mimetype
            };

            s3.upload(params, (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error uploading profile picture' });
                }

                res.status(200).json({ message: 'Profile picture uploaded successfully', location: data.Location });
            });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading profile picture' });
    }
};

module.exports = { handleProfilePictureChange };
