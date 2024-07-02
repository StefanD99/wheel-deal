import { useContext, useEffect, useRef, useState } from "react";
import AlertContext from "../../context/alertContext/AlertContext";
import ProfileContext from "../../context/profileContext/ProfileContext";
import {Card} from 'react-bootstrap';
import { Col, Image, Dropdown } from "react-bootstrap";
import { TbPhotoUp } from "react-icons/tb";
import { MdDriveFolderUpload } from "react-icons/md";
import { MdOutlineDeleteForever } from "react-icons/md";
import { ref } from "firebase/storage";
import { auth, storage } from '../../fbConfig';
import { removeSingleImage, uploadSingleImage } from "../../context/fileContext/fileActions";
import ActionTypes from "../../context/profileContext/profileActionTypes";
import './shared.css';



function SingleImageUploader({data, collection, objectName}) {

    const inputFileRef = useRef(null);
    const {showAlert} = useContext(AlertContext);
    const {user, dispatch} = useContext(ProfileContext);
    const [img, setImg] = useState(data?.photoUrl);

    const triggerFileInput = () => {
        inputFileRef.current.click();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        let imgUrl;
        let message;
        const imgRef = ref(storage, `${collection}/${Date.now()} - ${file.name}`); // users/datum_trenutni - moja slika.png
        switch (objectName) {
            case 'users':
                imgUrl = await uploadSingleImage(imgRef, file, objectName, data?.uid);
                setImg(imgUrl);
                break;
            default:
                break;
        }

        if (imgRef) {
            dispatch({
                action: ActionTypes.SET_USER_DATA,
                payload: {
                    ...user,
                    photoUrl: imgRef ? imgUrl : ''
                }
            });
            message = imgRef ? 'Your file has been successfully uploaded!' : 'Something went wrong please try again!'
            
            if (imgRef) {
                showAlert(message);
            } else {
                showAlert(message, 'danger');
            }
        } else {

        }
    };

    const handleImageRemove = async () => {
        let isRemoval = window.confirm('Please confirm file removal');
        if (!isRemoval) {
            return;
        }
        let isRemoved = false;
        switch (objectName) {
            case 'users':
                isRemoved = await removeSingleImage(objectName, data.uid);
                break;
            default:
                break;
        }
        if (!isRemoved) {
            showAlert('Something went wrong while deleting your file, please try again!', 'danger');
        }
        showAlert('Your file has been removed successfully!');
        dispatch({
            action: ActionTypes.SET_USER_DATA,
            payload: {
                ...user,
                photoUrl: ''
            }
        });
        setImg(null);
    };

    useEffect(() => {
        setImg(data.photoUrl);
    }, [user])

    return (
        <>
            <Card className="custom-card mb-3">
                {
                    img ?
                    <Col xs={6} md={4}>
                        <Image className="custom-image" alt={data.uid} src={img} />
                    </Col>
                    :
                    <TbPhotoUp size={150} className="py-2" />
                }
            </Card>
            {
                auth.currentUser.uid === user.uid && 
                <Dropdown className="mt-1">
                <Dropdown.Toggle variant="info" id="photo-dropdown-actions">
                    Profile Image
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="custom-db-item" onClick={triggerFileInput}>
                        <label>
                          <MdDriveFolderUpload className="custom-db-item" size={20} /> Upload new Image
                        </label>
                    </Dropdown.Item>
                    <input 
                                type="file"
                                id="image"
                                ref={inputFileRef}
                                accept="image/*"
                                style={{display: 'none'}}
                                onChange={handleImageUpload}
                            />
                            {
                                img &&  
                                    <Dropdown.Item onClick={handleImageRemove}>
                                        <label className="custom-dp-item">
                                            <MdOutlineDeleteForever size={20} /> Remove Image
                                        </label>
                                    </Dropdown.Item>
                            }   
                        </Dropdown.Menu>
                    </Dropdown>
            }
        </>
    )
};

export default SingleImageUploader;
