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

const handleProfilePictureChange = async (req, res) => {
    try {
        if (req.file) {
            const fileContent = req.file.buffer;
            const newFileName = `${uuid.v4()}-${req.file.originalname}`;
            const userId = req.body.id;

            const listParams = {
                Bucket: process.env.YANDEX_BUCKET_NAME,
            };

            s3.listObjectsV2(listParams, (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error listing profile pictures' });
                }

                const existingFile = data.Contents.find(item => item.Metadata && item.Metadata.userId === userId);

                if (existingFile) {
                    const deleteParams = {
                        Bucket: process.env.YANDEX_BUCKET_NAME,
                        Key: existingFile.Key,
                    };

                    s3.deleteObject(deleteParams, (err, data) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: 'Error deleting old profile picture' });
                        }

                        const uploadParams = {
                            Bucket: process.env.YANDEX_BUCKET_NAME,
                            Key: newFileName,
                            Body: fileContent,
                            Metadata: {
                                userId: userId
                            },
                            ContentType: req.file.mimetype
                        };

                        s3.upload(uploadParams, (err, data) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: 'Error uploading new profile picture' });
                            }

                            res.status(200).json({ message: 'Profile picture changed successfully', location: data.Location });
                        });
                    });
                } else {
                    const uploadParams = {
                        Bucket: process.env.YANDEX_BUCKET_NAME,
                        Key: newFileName,
                        Body: fileContent,
                        Metadata: {
                            userId: userId
                        },
                        ContentType: req.file.mimetype
                    };

                    s3.upload(uploadParams, (err, data) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: 'Error uploading profile picture' });
                        }

                        res.status(200).json({ message: 'Profile picture uploaded successfully', location: data.Location });
                    });
                }
            });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error changing profile picture' });
    }
};

const handleProfilePictureDeletion = async(req, res) => {
    try {
        const userId = req.body.id;

        console.log(req.body)

        const listParams = {
            Bucket: process.env.YANDEX_BUCKET_NAME,
        };
        s3.listObjectsV2(listParams, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error listing profile pictures' });
            }
            // console.log(data.Contents)

            const existingFile = data.Contents.find(item => item.Metadata && item.Metadata.userId === userId);

            if (existingFile) {
                const deleteParams = {
                    Bucket: process.env.YANDEX_BUCKET_NAME,
                    Key: existingFile.Key,
                };

                s3.deleteObject(deleteParams, (err, data) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Error deleting old profile picture' });
                    }
                });
            }
            else{
                return res.status(200).json({message : 'User\'s profile picture not found'})
            }
        })
    }catch(err){
        console.error(error);
        res.status(500).json({ message: 'Error changing profile picture' });
    }
}

module.exports = { handleProfilePictureUpload, handleProfilePictureChange, handleProfilePictureDeletion };
