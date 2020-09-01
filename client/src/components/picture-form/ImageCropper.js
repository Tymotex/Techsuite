/* eslint-disable jsx-a11y/media-has-caption, class-methods-use-this */
import React, { PureComponent } from 'react';
import Cookie from 'js-cookie';
import { Form, FormGroup, FormText, Input, Label, Button, Row, Col } from 'reactstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';
import './PictureForm.scss';

class ImageCropper extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            src: null,
            crop: {
                unit: '%',
                width: 30,
                aspect: 1,
            },
            croppedImageUrl: null,
            selectedImageFile: null,
            cropBoundaries: {
                widthStart: -1,
                heightStart: -1,
                widthEnd: -1,
                heightEnd: -1
            }
        };
        this.onSelectFile = this.onSelectFile.bind(this);
        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.onCropComplete = this.onCropComplete.bind(this);
        this.onCropChange = this.onCropChange.bind(this);
        this.makeClientCrop = this.makeClientCrop.bind(this);
        this.getCroppedImg = this.getCroppedImg.bind(this);
        this.uploadImageFile = this.uploadImageFile.bind(this);
    }
    
    // ===== Upload and Cropping Functions =====
    onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);

            this.setState({
                selectedImageFile: e.target.files[0]
            })
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
        this.makeClientCrop(crop);
    };
    
    async makeClientCrop(crop) {
        // The image is loaded and the final dimensions are valid:
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ 
                croppedImageUrl, 
                cropBoundaries: {
                    widthStart: crop.x,
                    heightStart: crop.y,
                    widthEnd: crop.x + crop.width,
                    heightEnd: crop.y + crop.height
                }
            });
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

        console.log("xstart: " + crop.x);
        console.log("ystart: " + crop.y);
        console.log("xend: " + (crop.x + crop.width));
        console.log("yend: " + (crop.y + crop.height));

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
    
        // return canvas.toDataURL("image/png");

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

    // API call:
    uploadImageFile(event) {
        event.preventDefault();
        const currUserToken = Cookie.get("token");
        const currUserID = Cookie.get("user_id");
        const fd = new FormData();
        fd.append("file", this.state.selectedImageFile, "placeholder.png");
        fd.append("user_id", currUserID); 
        fd.append("token", currUserToken); 
        fd.append("x_start", Math.floor(this.state.cropBoundaries.widthStart));
        fd.append("y_start", Math.floor(this.state.cropBoundaries.heightStart));
        fd.append("x_end", Math.floor(this.state.cropBoundaries.widthEnd));
        fd.append("y_end", Math.floor(this.state.cropBoundaries.heightEnd));

        console.log("Cropped image dimensions: ");
        console.log(this.state.cropBoundaries);

        const postData = {
            method: "POST",
            url: `${BASE_URL}/${this.props.uploadEndpoint}`,
            data: fd,
            headers: {
                "Content-Type": "application/json"
            }
        };
        axios(postData)
            .then((res) => {
                console.log(res);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            })
    }
    
    render() {
        const { crop, croppedImageUrl, src } = this.state;
        const tmpStyle = {
            // "text-align": "center"
        };
        const imageStyle = {
            "border": "thick double black"
        }
        return (
            <>
                {/* Form title */}
                {this.props.title ? (
                    <>
                        <h3>{this.props.title}</h3>
                        <div className="title-hr">
                            <hr />
                        </div>
                    </>
                ) : (<></>)}
                {/* Picture form */}
                <Form onSubmit={this.uploadImageFile}>
                    <FormGroup>
                        <Input id="fileinput" type="file" accept="image/*" onChange={this.onSelectFile} />
                        <Label id="fileinputlabel" for="fileinput">Upload image</Label>
                    </FormGroup>
                    <Button color="primary">Update Profile Picture</Button>
                    
                    <Row style={{"margin-top": "10px"}}>
                        <Col sm={12} md={6}>
                            {src && (
                                <ReactCrop style={imageStyle}
                                    src={src}
                                    crop={crop}
                                    ruleOfThirds
                                    onImageLoaded={this.onImageLoaded}
                                    onComplete={this.onCropComplete}
                                    onChange={this.onCropChange}
                                />
                            )}
                        </Col>
                        <Col sm={12} md={6}>
                            {croppedImageUrl && (
                                <img alt="Crop" style={imageStyle} src={croppedImageUrl} />
                            )}
                        </Col>
                    </Row>
                </Form>
            </>
        );
    }
}

export default ImageCropper;
