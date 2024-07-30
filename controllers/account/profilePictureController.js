const AWS = require('aws-sdk');
const uuid = require('uuid');
const sharp = require('sharp');
const UserProfilePicture = require('../../model/UserProfilePicture');
const s3 = new AWS.S3({
    endpoint: 'https://storage.yandexcloud.net',
    region: 'ru-central1',
    accessKeyId: process.env.YANDEX_ACCESS_KEY,
    secretAccessKey: process.env.YANDEX_SECRET_KEY,
});
const bucketName = process.env.YANDEX_BUCKET_NAME;

const handleProfilePictureUpload = async (req, res) => {
    try {
        if (req.file) {
            const fileContent = req.file.buffer;
            const fileName = `${uuid.v4()}-${req.file.originalname}`;
            const userId = req.body.id;
            const format = req.file.mimetype.split('/')[1];

            let compressedBuffer;
            switch (format) {
                case 'png':
                    compressedBuffer = await sharp(fileContent)
                        .resize({ width: 800 }) 
                        .png({ compressionLevel: 9 }) // Lossless compression for PNG
                        .toBuffer();
                    break;
                case 'jpeg':
                case 'jpg':
                    compressedBuffer = await sharp(fileContent)
                        .resize({ width: 800 }) 
                        .jpeg({ quality: 90 }) // High quality JPEG (near-lossless)
                        .toBuffer();
                    break;
                case 'webp':
                    compressedBuffer = await sharp(fileContent)
                        .resize({ width: 800 }) 
                        .webp({ lossless: true }) // Lossless compression for WebP
                        .toBuffer();
                    break;
                default:
                    return res.status(400).json({ message: 'Unsupported image format' });
            }

            const uploadParams = {
                Bucket: bucketName,
                Key: fileName,
                Body: compressedBuffer,
                ContentType: req.file.mimetype
            };

            s3.upload(uploadParams, async(err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error uploading profile picture' });
                }

                try {
                    console.log(data)
                    const result = await UserProfilePicture.create({
                        userId : userId, 
                        Key : data.Key, 
                    })

                    const base64Image = compressedBuffer.toString('base64');
                    const contentType = req.file.mimetype;
                    const response = {
                        id: result._id,
                        image: `data:${contentType};base64,${base64Image}`
                    };
            
                    return res.status(200).json(response);

                }catch (dbErr) {
                    console.error('Error saving to database:', dbErr);
                    return res.status(500).json({ message: 'Error saving profile picture information' });
                }
            });
        } else {
            return res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error uploading profile picture' });
    }
};

const handleProfilePictureChange = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileContent = req.file.buffer;
        const newFileName = `${uuid.v4()}-${req.file.originalname}`;
        const schemaId = req.body.id;
        const format = req.file.mimetype.split('/')[1];

        // const listParams = { Bucket: bucketName };

        // const listData = await s3.listObjectsV2(listParams).promise();
        const foundUser = await UserProfilePicture.findOne({_id : schemaId}).exec()

        // for (const obj of listData.Contents) {
        //     const headParams = {
        //         Bucket: bucketName,
        //         Key: obj.Key
        //     };

        //     const headData = await s3.headObject(headParams).promise();
        //     if (headData.Metadata.userid === userId) { 
        //         console.log(`Found object with userId ${userId}: ${obj.Key}`);
        //         keyToDelete = obj.Key;
        //         break;
        //     }
        // }

        if (foundUser) {
            const deleteParams = {
                Bucket: bucketName,
                Key: foundUser.Key
            };

            await s3.deleteObject(deleteParams).promise();
        }

        let compressedBuffer;
        switch (format) {
            case 'png':
                compressedBuffer = await sharp(fileContent)
                    .resize({ width: 800 }) 
                    .png({ compressionLevel: 9 }) // Lossless compression for PNG
                    .toBuffer();
                break;
            case 'jpeg':
            case 'jpg':
                compressedBuffer = await sharp(fileContent)
                    .resize({ width: 800 }) 
                    .jpeg({ quality: 90 }) // High quality JPEG (near-lossless)
                    .toBuffer();
                break;
            case 'webp':
                compressedBuffer = await sharp(fileContent)
                    .resize({ width: 800 }) 
                    .webp({ lossless: true }) // Lossless compression for WebP
                    .toBuffer();
                break;
            default:
                return res.status(400).json({ message: 'Unsupported image format' });
        }

        const uploadParams = {
            Bucket: bucketName,
            Key: newFileName,
            Body: compressedBuffer,
            ContentType: req.file.mimetype
        };

        s3.upload(uploadParams, async(err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error uploading profile picture' });
            }

            try {
                foundUser.Key = data.Key; 
                await foundUser.save()
                const base64Image = compressedBuffer.toString('base64');
                const contentType = req.file.mimetype;
                const response = {
                    id: foundUser._id,
                    image: `data:${contentType};base64,${base64Image}`
                };
        
                return res.status(200).json(response);

            }catch (dbErr) {
                console.error('Error saving to database:', dbErr);
                return res.status(500).json({ message: 'Error saving profile picture information' });
            }
        });

    } catch (error) {
        console.error('Error changing profile picture:', error);
        res.status(500).json({ message: 'Error changing profile picture' });
    }
};


const handleProfilePictureDeletion = async (req, res) => {
    try {
        
        const schemaId = req.body.id ?? req.body.userId;
        const foundUser = await UserProfilePicture.findOne(req.body.id ? {_id : schemaId} : {userId : schemaId}).exec();

        if (!foundUser) {
            return res.status(404).json({ message: 'User\'s profile picture not found' });
        }

        const deleteParams = {
            Bucket: bucketName,
            Key: foundUser.Key
        };

        await s3.deleteObject(deleteParams).promise();
        await UserProfilePicture.deleteOne({_id : schemaId});
        return res.status(200).json({ message: 'Profile picture deleted successfully' });

    } catch (error) {
        console.error('Error deleting profile picture:', error);
        return res.status(500).json({ message: 'Error deleting profile picture' });
    }
};

const handleGetProfilePicture = async (req, res) => {
    try {
        const userId = req.body.id;
        
        const foundUser = await UserProfilePicture.findOne({ userId }).exec();

        if (!foundUser) {
            return res.status(404).json({ message: 'Profile picture not found' });
        }

        const params = {
            Bucket: bucketName,
            Key: foundUser.Key
        };

        const data = await s3.getObject(params).promise();

        const base64Image = data.Body.toString('base64');
        const contentType = data.ContentType;

        const response = {
            id: foundUser._id,
            image: `data:${contentType};base64,${base64Image}`
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving profile picture:', error);
        return res.status(500).json({ message: 'Error retrieving profile picture' });
    }
};


module.exports = { handleProfilePictureUpload, handleProfilePictureChange, handleProfilePictureDeletion, handleGetProfilePicture };
