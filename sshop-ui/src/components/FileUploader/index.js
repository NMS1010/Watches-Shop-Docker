import { useState } from 'react';
import preImage from '../../assets/images/common/preImage.jpg';
import { IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const FileUploader = ({
    setFileSelected,
    setFileSelectedError,
    fileSize = 4096 * 1024,
    accept = 'image/*',
    imgUrl = '',
    imageStyle = 'w-full m-auto rounded-2xl',
}) => {
    const [imageURL, setImageURL] = useState(
        imgUrl && !imgUrl.includes('blob') ? `${process.env.REACT_APP_HOST}${imgUrl}` : '',
    );
    const handleSelectFile = (e) => {
        const file = e.target.files[0];
        if (!file) setFileSelectedError('File is required');
        else {
            if (file.size > fileSize) {
                setFileSelectedError(`File size cannot exceed more than ${fileSize}`);
            } else {
                setImageURL(URL.createObjectURL(file));
                setFileSelected(file);
                setFileSelectedError('');
            }
        }
    };
    const id = Math.random();
    return (
        <div className="relative text-center">
            <img id={`${id}`} className={imageStyle} src={imageURL || imgUrl || preImage} />
            <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept={accept} id={`${id}`} type="file" onChange={(e) => handleSelectFile(e)} />
                <PhotoCamera sx={{ fontSize: 30, color: '#333' }} />
            </IconButton>
        </div>
    );
};

export default FileUploader;
