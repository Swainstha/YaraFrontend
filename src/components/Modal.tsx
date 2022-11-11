 import React from "react";

 import Modal from "@mui/material/Modal";
//import './Modal.css';
 const ModalComp:React.FC<{children: any, handleClose: any, open: boolean}> = (props) =>
 {
   const { children, handleClose, open} = props;
   return (
     <Modal 
       open={open}
       onClose={handleClose}
       closeAfterTransition
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
     >
       <div className={`modal-wrapper`}>
         {children}
       </div>
     </Modal>
   );
 };
 
 export default ModalComp;
 