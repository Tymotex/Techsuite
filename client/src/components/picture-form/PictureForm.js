/* eslint-disable jsx-a11y/media-has-caption, class-methods-use-this */
import React, { PureComponent } from 'react';
import { Form, FormGroup, FormText, Input, Label, Button } from 'reactstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

class PictureForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            src: null,
            crop: {
                unit: '%',
                width: 30,
                aspect: 1,
            },
            croppedImageUrl: null
        };
        this.onSelectFile = this.onSelectFile.bind(this);
        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.onCropComplete = this.onCropComplete.bind(this);
        this.onCropChange = this.onCropChange.bind(this);
        this.makeClientCrop = this.makeClientCrop.bind(this);
        this.getCroppedImg = this.getCroppedImg.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
    }
    
    // ===== Upload and Cropping Functions =====
    onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    // If you setState the crop in here you should return false.
    onImageLoaded(image) {
        console.log("Loaded the image!");
        this.imageRef = image;
    };
    
    onCropComplete(crop) {
        console.log("Finalising the crop!");
        this.makeClientCrop(crop);
    };
    
    onCropChange(crop, percentCrop) {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        console.log("Readjusting the crop!");
        this.setState({ crop });
    };
    
    async makeClientCrop(crop) {
        // The image is loaded and the final dimensions are valid:
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ croppedImageUrl });
        }
    }
    
    getCroppedImg(image, crop, fileName) {
        console.log("Drawing the cropped image onto the canvas!");
        // Render a canvas containing the cropped image
        // See the MDN Canvas API docs: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

    // ===== API call =====
    uploadPicture() {
        console.log("Trying to upload picture now!");
        
    }
    
    render() {
        const { crop, croppedImageUrl, src } = this.state;
        return (
            <>
                <Form onSubmit={this.uploadPicture}>
                    <FormGroup>
                        <Label for="image-url">Image URL</Label>
                        <Input type="text" id="image-url" placeholder="Image URL" />
                        <FormText color="muted">
                            Paste the URL to an image here
                        </FormText>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleFile">File</Label>
                        <Input type="file" accept="image/*" onChange={this.onSelectFile} />
                        <FormText color="muted">
                            Upload an image file
                        </FormText>
                    </FormGroup>
                    <Button>Upload Picture</Button>
                </Form>

                {src && (
                    <ReactCrop
                        src={src}
                        crop={crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />
                )}
                {croppedImageUrl && (
                    <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
                )}
            </>
        );
    }
}

export default PictureForm;
