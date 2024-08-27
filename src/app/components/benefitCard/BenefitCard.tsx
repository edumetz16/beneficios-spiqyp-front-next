'use client'
import { useAuth } from "@/app/auth/AuthContext";
import { Benefit } from "@/shared/types.shared";
import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { VoucherIcon } from "../icons/VoucherIcon";

const BenefitCard = ({benefit}:{benefit:Benefit}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [responseError,setResponseError] = useState('');
    const [modalError, setModalError] = useState(false);
    const [ticket, setTicket] = useState<any>({});

    const [couponValue, setCouponValue] = useState('');

    const {user} = useAuth();

    const cuponRequest = async (benefitId:any) => {
        const response = await fetch("/api/cupon",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                benefitId:benefitId,
                userId:user?.uid,
                userEmail:user?.email
            })
        })


        const responseJson = await response.json();
        if (!responseJson.success) {
            setResponseError(responseJson.msg);
            setModalError(true);
            onOpen();

        } else {
            setTicket(responseJson.data)
            onOpen();

        } 
        
    }
    
    return(
        <>
        <div className="col-span-12 lg:col-span-8 text-black p-4 lg:p-4 rounded-lg mb-6 bg-white relative">
            <div className="flex flex-col gap-1 lg:gap-2 max-w-[calc(100%-64px)]">
                <h3 className="text-xl lg:text-2xl font-bold">{benefit.title}</h3>
                <p className="text-md lg:text-lg">{benefit.description}</p>
                {(benefit.startDate || benefit.endDate) && <p>Disponible {benefit.startDate && `desde el : ${benefit.startDate.toLocaleDateString()}`} {benefit.endDate && `hasta el ${benefit.endDate.toLocaleDateString()}`}</p>}
                <p>{benefit.termsAndConditions}</p>
                {couponValue ? <div className="flex gap-2 items-center p-2 bg-gray-300 rounded-md w-fit"><div className="w-6"><VoucherIcon/></div>{couponValue}</div> : 
                    <Button className={`btn w-fit text-white`} onClick={ () => {if(benefit.redemptionType === 'dynamic_code') {cuponRequest(benefit.id) } else if(benefit.redemptionType === 'static_code') setCouponValue(benefit.redemptionValue as string)}}>Solicitar cupon</Button>
                }
                {benefit.redemptionType === 'link' && <Button as={Link} href={benefit.redemptionValue} className={`btn w-fit text-white`}>Acceder al beneficio</Button>}
            </div>
            <div className="absolute h-full w-16 top-0 right-0 border-dashed border-l border-gray-400">
                <div className="absolute right-0 top-[calc(50%-16px)] w-4 h-8 rounded-tl-2xl rounded-bl-2xl  border-r-transparent bg-[#f6f6f3]"></div>
                {/* <div className="absolute -left-2 top-0 w-4 h-2 rounded-bl-xl rounded-br-xl  border-t-transparent bg-[#f6f6f3]"></div>
                <div className="absolute -left-2 bottom-0 w-4 h-2 rounded-tl-xl rounded-tr-xl  border-b-transparent bg-[#f6f6f3]"></div> */}
            </div>
        </div>
        
        <Modal className="text-black" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">{modalError? 'Error al generar el cupon':'Cupon generado con exito'}</ModalHeader>
                <ModalBody>
                    <div className={`${modalError ? 'block': 'hidden'}`}>
                        <p className="text-rose-900"> 
                        {responseError}
                        </p>
                    </div>
                    <div className={`${modalError ? 'hidden':'block'} flex flex-col gap-4`}>
                        <h3 className="text-2xl font-bold">Codigo de cupon {ticket.code}</h3>
                        <p className="text-md">{ticket.benefitTitle}</p>
                        <p className="text-md">{user?.email}</p>
                        <p className="text-md">{ticket.startDate && `valido desde ${ticket.startDate}`} {ticket.endDate && `hasta ${ticket.endDate}`}</p>
                        <p className="text-md">terminos y condiciones</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
        </>
    )
}

export default BenefitCard;