import { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";

function Navbar(props){

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const textArea = useRef(null);    

    return(
        <nav className="navbar navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                

            <a href=" " className="navbar-brand m-auto ">
                MTG Proxy (beta)
                
            </a>
   
      
            <form onSubmit={(e) => {e.preventDefault(); props.onAdd()}} className="d-flex container w-50 m-auto">
            <input onChange={(e) => props.onChange(e)} className="form-control m-auto" type="search" placeholder="Search" aria-label="Search" />
            </form>

            <form className="d-flex m-auto">
            <button onClick={() => props.onAdd()} className="btn btn-outline-primary m-2" type="button">Add</button>
            <button onClick={handleShow} className="btn btn-outline-warning m-2" type="button">Load</button>
            <button onClick={() => props.onRandom()} className="btn btn-outline-secondary m-2" type="button">Random</button>
            <button onClick={() => props.onSave()} className="btn btn-outline-success m-2" type="button">Save</button>
            </form>


            

                      
            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Import deck</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea ref={textArea} placeholder={"4 Griselbrand\n2 Sol Ring\n4 Black Lotus"} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => props.onLoad(textArea)}>
                    Load decklist
                </Button>
            </Modal.Footer>
            </Modal>

            </div>
        </nav>
    );

}

export default Navbar;