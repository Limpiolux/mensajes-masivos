import { useState, useEffect, React } from "react";
import { AiOutlineQrcode } from "react-icons/ai";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { TbClick } from "react-icons/tb";
import { FaWhatsapp } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { LuTimer } from "react-icons/lu";
import { RiWhatsappFill } from "react-icons/ri";

function EstadoWhatsapp({ setIsLogged, isLogged, phoneNumber, setPhoneNumber }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [qrSvg, setQrSvg] = useState("");

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const loginResponse = await fetch("http://localhost:7131/login");
        const { status, phoneNumber: receivedPhoneNumber } =
          await loginResponse.json();

        // Guardar el número telefónico si está disponible
        if (receivedPhoneNumber) {
          setPhoneNumber(receivedPhoneNumber);
        }

        // Si el status es true, no mostrar el QR
        if (status) {
          setIsLogged(true);
          setQrSvg(""); // Limpiar el contenido del QR
          return;
        }

        // Si el status es false, obtener y mostrar el QR
        const qrResponse = await fetch("http://localhost:7131/qr");
        const qrSvgContent = await qrResponse.text();
        setQrSvg(qrSvgContent);
        setIsLogged(false);
      } catch (error) {
        console.error("Error al obtener el código QR:", error);
      }
    };

    // Llamar a fetchQrCode inicialmente y luego configurar el intervalo para actualizar cada 2 segundos
    fetchQrCode();
    const intervalId = setInterval(() => {
      fetchQrCode();
    }, 2000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="rounded-lg border bg-white p-5 shadow-sm transition hover:border-blue-600 dark:border-gray-800 dark:bg-gray-800 dark:shadow-none border-blue-400 md:p-7 xl:p-10">
        <svg
          className="hi-outline hi-rectangle-stack mb-5 inline-block h-12 w-12 text-limpiolux-600 dark:text-limpiolux-500"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <AiOutlineQrcode style={{ fontSize: "45px" }} />
        </svg>
        <h4 className="mb-2 text-lg font-bold">1. Estado del Whatsapp</h4>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          Verificar estado del Bot de Whatsapp, para saber si tiene permisos
          para enviar los mensajes. Si no está logueado, por favor escanear el
          QR.
        </p>
        <Button
          onPress={onOpen}
          style={{
            marginTop: "20px",
            backgroundColor: "#0075A9",
            color: "#ffffff",
          }}
        >
          <TbClick /> Abrir
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Estado del Whatsapp
                </ModalHeader>
                <ModalBody>
                  {isLogged ? (
                    <>
                      <Chip
                        startContent={<RiWhatsappFill size={18} />}
                        variant="faded"
                        color="success"
                        className="ml-4"
                      >
                        N° Registrado: +{phoneNumber}
                      </Chip>

                      <div className="flex gap-2">
                        <Chip
                          startContent={<AiFillCheckCircle size={18} />}
                          variant="faded"
                          color="success"
                          className="ml-4"
                        >
                          Logueado
                        </Chip>
                        <Chip
                          startContent={<LuTimer size={18} />}
                          variant="faded"
                          color="warning"
                          className=""
                        >
                          30 min para usar
                        </Chip>
                      </div>

                      <div className="ml-4">
                        Estas logueado, ya puedes pasar a la siguiente etapa
                        <strong> Automatización de Mensajes </strong>
                        para enviar mensajes masivos.
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="flex gap-2">
                          <Chip
                            startContent={<AiFillCloseCircle size={18} />}
                            variant="faded"
                            color="warning"
                            className="ml-4"
                          >
                            No logueado
                          </Chip>
                        </div>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: qrSvg }} />

                      <div className="ml-4">
                        Escanea el código QR para poder enviar mensajes másivos
                        en Whatsapp.
                      </div>
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default EstadoWhatsapp;
