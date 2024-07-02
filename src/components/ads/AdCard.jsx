import { Card, Button, Dropdown } from "react-bootstrap";
import { convertFBTimestampToDate } from "../../utils/dateUtil";
import { useContext, useState } from "react";
import './ads.css';
import AdDetails from "./AdDetails";
import UpsertAdModal from "./UpsertAdModal";
import AlertContext from "../../context/alertContext/AlertContext";
import { deleteAdById, updateAsSold } from "../../context/adContext/adActions";


function AdCard({cardData, isEditEnabled}) {

    const {showAlert} = useContext(AlertContext);
    const [isShowDetails, setIsShowDetails] = useState(false);
    const handleShow = () => setIsShowDetails(true);
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setIsShowDetails(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);



    const onUpdateAd = () => {
        handleOpenModal();
    };

    const onDeleteAd = (adId) => {
        if (window.confirm('Please confirm deletion of your ad')) {
            const deleteAd = deleteAdById(adId)
            if (deleteAd) {
                showAlert('You have successfully deleted your ad!');
            } else {
                showAlert('Ooops! Something went wrong, please try again later!', 'danger');
            }
        }
    };

    const onMarkedAsSold = (cardData) => {
        if (window.confirm('Please confirm marking ad as sold')) {
            const isSold = updateAsSold(cardData);
            const alertMsg = isSold ? 'Congradulations! You have sold your vehicle!' : 'Ooops, something went wrong, please try again later!';
            const alertType = isSold ? 'success' : 'danger';
            showAlert(alertMsg, alertType);
        }
    };

    return (
        <>
            <Card className={`mb-4 custom-card shadow ${cardData.isSold ? 'card-sold' : ''}`}>
                {cardData.isSold && <div className="sold-overlay">SOLD</div>}
                <Card.Img className="custom-card-img" variant="top" src={cardData.images[0].url} />
                <Card.Body>
                    <Card.Title>{cardData.title}</Card.Title>
                    <Card.Subtitle>{cardData.price} €</Card.Subtitle>
                    <Card.Text className="mt-1">
                        Published at <strong>{convertFBTimestampToDate(cardData.publishedAt)}</strong>
                    </Card.Text>
                    <div className="container d-flex justify-content-between">
                        <Button disabled={cardData.isSold} onClick={handleShow} variant="outline-primary">More details</Button>
                        {
                            isEditEnabled &&
                                <Dropdown className="mt-2">
                                    <Dropdown.Toggle variant="outline-primary" disabled={cardData.isSold}>
                                        Ad Actions
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => onUpdateAd()}>
                                            Edit Ad
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => onDeleteAd(cardData.id)}>
                                            Delete Ad
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => onMarkedAsSold(cardData)}>
                                            Mark as sold
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                        }
                    </div>
                </Card.Body>
            </Card>
            <UpsertAdModal 
                show={showModal}
                handleClose={handleCloseModal}
                isUpdateModal={true}
                adData={cardData}
            />

            <AdDetails adData={cardData} show={isShowDetails} handleClose={handleClose}/>
        </>
    )
};

export default AdCard;
