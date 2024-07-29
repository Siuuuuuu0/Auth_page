const AWS = require('aws-sdk');
const uuid = require('uuid');

const s3 = new AWS.S3({
    endpoint: 'https://storage.yandexcloud.net',
    region: 'ru-central1',
    accessKeyId: process.env.YANDEX_ACCESS_KEY,
    secretAccessKey: process.env.YANDEX_SECRET_KEY,
});

const handleProfilePictureUpload = async (req, res) => {
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
                    userId : userId
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

const handleProfilePictureChange = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileContent = req.file.buffer;
        const newFileName = `${uuid.v4()}-${req.file.originalname}`;
        const userId = req.body.id;
        const bucketName = process.env.YANDEX_BUCKET_NAME;

        const listParams = { Bucket: bucketName };

        const listData = await s3.listObjectsV2(listParams).promise();
        let keyToDelete = null;

        for (const obj of listData.Contents) {
            const headParams = {
                Bucket: bucketName,
                Key: obj.Key
            };

            const headData = await s3.headObject(headParams).promise();
            if (headData.Metadata.userid === userId) { 
                console.log(`Found object with userId ${userId}: ${obj.Key}`);
                keyToDelete = obj.Key;
                break;
            }
        }

        if (keyToDelete) {
            const deleteParams = {
                Bucket: bucketName,
                Key: keyToDelete
            };

            await s3.deleteObject(deleteParams).promise();
        }

        const uploadParams = {
            Bucket: bucketName,
            Key: newFileName,
            Body: fileContent,
            Metadata: {
                userId: userId 
            },
            ContentType: req.file.mimetype
        };

        const uploadData = await s3.upload(uploadParams).promise();
        res.status(200).json({ message: 'Profile picture changed successfully', location: uploadData.Location });

    } catch (error) {
        console.error('Error changing profile picture:', error);
        res.status(500).json({ message: 'Error changing profile picture' });
    }
};


const handleProfilePictureDeletion = async (req, res) => {
    try {
        const userId = req.body.id;
        const bucketName = process.env.YANDEX_BUCKET_NAME;

        const listParams = { Bucket: bucketName };

        const listData = await s3.listObjectsV2(listParams).promise();
        let keyToDelete = null;

        for (const obj of listData.Contents) {
            const headParams = {
                Bucket: bucketName,
                Key: obj.Key
            };

            const headData = await s3.headObject(headParams).promise();
            // console.log(headData.Metadata)
            if (headData.Metadata.userid === userId) {
                console.log(`Found object with userId ${userId}: ${obj.Key}`);
                keyToDelete = obj.Key;
                break;
            }
        }

        if (!keyToDelete) {
            return res.status(404).json({ message: 'User\'s profile picture not found' });
        }

        const deleteParams = {
            Bucket: bucketName,
            Key: keyToDelete
        };

        await s3.deleteObject(deleteParams).promise();
        return res.status(200).json({ message: 'Profile picture deleted successfully' });

    } catch (error) {
        console.error('Error deleting profile picture:', error);
        return res.status(500).json({ message: 'Error deleting profile picture' });
    }
};


module.exports = { handleProfilePictureUpload, handleProfilePictureChange, handleProfilePictureDeletion };
