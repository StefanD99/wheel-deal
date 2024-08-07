import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { logoutUser } from '../context/authContext/authActions';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/authContext/AuthContext';
import ActionTypes from '../context/authContext/authActionTypes';
import AlertContext from '../context/alertContext/AlertContext';
import { useUserAuthStatus } from '../hooks/useUserAuthStatus';
import { auth } from '../fbConfig';
import AdContext from '../context/adContext/AdContext';
import StatsContext from '../context/statsContext/StatsContext';

function CustomNavbar() {
  const navigate = useNavigate();
  const {isAuthenticated, checkingStatus} = useContext(AuthContext);
  const {dispatch} = useContext(AuthContext);
  const {dispatch: adDispatch} = useContext(AdContext);
  const {dispatch: statsDispatch} = useContext(StatsContext);
  const [showOffNavbar, setShowOffNavbar] = useState(false);
  const {showAlert} = useContext(AlertContext);


  const onLogout = async () => {
    const logoutResponse = await logoutUser();
    if (logoutResponse) {
      dispatch({
        type: ActionTypes.LOGOUT_SUCCESS
      });
      adDispatch({
        type: 'SET_ADS_FOR_USER',
        payload: []
      });
      statsDispatch({
        type: 'SET_EMPTY_USER_STATS'
      });
      showAlert('You have successfully logged out!');
      navigate('/auth/login');
    } else {
      dispatch({
        type: ActionTypes.LOGOUT_ERROR
      });
      showAlert('Ooops! Something went wrong!');
    }
    setShowOffNavbar(false);
  };

  if (checkingStatus) {
    return <h1>Loading User data...</h1>;
  }

  return (
    <>
 
        <Navbar  expand={false} className="bg-body-tertiary mb-3">
          <Container fluid>
            <Navbar.Brand as={Link} to={'/'}>Wheel Deal Inc.</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} onClick={() => setShowOffNavbar(true)} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${false}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
              placement="end"
              show={showOffNavbar}
              onHide={() => setShowOffNavbar(false)}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link as={Link} to={'/'} onClick={() => setShowOffNavbar(false)}>Home</Nav.Link>
                  {isAuthenticated && <Nav.Link as={Link} to={'/ads'} onClick={() => setShowOffNavbar(false)}>Ads</Nav.Link>}
                  {isAuthenticated && <Nav.Link as={Link} to={`profile/${auth.currentUser?.uid}`} onClick={() => setShowOffNavbar(false)}>Profile</Nav.Link>}
                  {isAuthenticated && <Nav.Link as={Link} to={'/stats'} onClick={() => setShowOffNavbar(false)}>Your selling stats</Nav.Link>}
                  <NavDropdown
                    title="User actions"
                    id={`offcanvasNavbarDropdown-expand-${false}`}
                  >
                    {
                      !isAuthenticated ? 
                      <><NavDropdown.Item as={Link} to={'/auth/login'} onClick={() => setShowOffNavbar(false)}>
                      <Button variant='outline-none'>Login</Button>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to={'/auth/register'} onClick={() => setShowOffNavbar(false)}>
                      <Button variant='outline-none'>Register</Button>
                    </NavDropdown.Item>
                    </>
                     : 
                     <NavDropdown.Item >
                     <Button variant='outline-none' onClick={onLogout}>Logout</Button>
                   </NavDropdown.Item>
                    }

                  </NavDropdown>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
  );
}

export default CustomNavbar;