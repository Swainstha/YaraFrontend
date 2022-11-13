 /**
 * This is a modal component inside which other components can be rendered
 * @param {any} props.children - children to be rendered inside the modal
 * @param {Function} props.handleClose - function to close the modal
 * @param {boolean} props.open - whether to open the modal or not
 * @returns {typeof ModalComp}
 */
 
 import React from "react";

 import Modal from "@mui/material/Modal";

 const ModalComp:React.FC<{children: any, handleClose: () => void, open: boolean}> = (props) =>
 {
   const { children, handleClose, open} = props;
   return (
     <Modal 
       open={open}
       onClose={handleClose}
       closeAfterTransition
       aria-labelledby="Visualize Measurements"
     >
       <div className={`modal-wrapper`}>
         {children}
       </div>
     </Modal>
   );
 };
 
 export default ModalComp;
 