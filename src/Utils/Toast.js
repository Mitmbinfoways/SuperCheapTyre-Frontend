import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GLOBAL_TOAST_ID = "GLOBAL_SINGLE_TOAST";

export const Toast = ({
  message,
  type = "default",
  autoClose = 3000,
}) => {
  if (toast.isActive(GLOBAL_TOAST_ID)) return;
  toast(message, {
    toastId: GLOBAL_TOAST_ID,
    type,
    position: "top-right", 
    autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};