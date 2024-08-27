import { collection, doc } from "firebase/firestore";
import { db } from "../firestore/firestore"
import { SendEmail } from "../email/email";

interface Coupon {
    code:string;
    benefitName:string;
    benefitDescription:string;
    starDate:string;
    endDate:string;
    terms:string
    redemptionNumber:number
}

interface SendGridMail{
    to: string[];
    from: string;
    subject: string;
    html: string;
}

export const getCuponByBenefit = async (benefitId:string,userUid:string,userEmail:string) => {
    const today = new Date();

    const benefitRef = await db.doc(`benefits/${benefitId}`);
    const benefit = (await benefitRef.get()).data();
    const couponRef = db.collection('coupons');
    const couponRes = await couponRef.where('benefit', '==' , benefitRef)
                        .where('activo','==',true).get();
    
    if (couponRes.empty) {
        return {success:false,msg:"No se encontro el cupon activo"}
    }
    const coupon = couponRes.docs.map( doc => {return {"id":doc.id,...doc.data()}}) as any;
    //Ahora valido si puedo generar el cupo
    //1. No he exedido el numero de cupones disponibles del beneficio
    if (!benefit || benefit.maxPurchase < 1) {
        //Ya se alcanzo el maximo de compras del cupon
        return {success:false, msg:"Se excedio el maximo de compras"}
    }

    //2. La fecha actual esta entre las de inicio y fin
    const startDate = coupon[0].startDate.toDate();
    const endDate = coupon[0].endDate.toDate();
    
    if (startDate < today && today > endDate) {
        //la fecha actual no esta en el rango establecido por el cupon
        return {success:false, msg:"La fecha del cupon ya paso"}
    }

    //3. El usuario ya tiene un cupon
    const ticketsPerUser = (await db.collection('tickets').where('userUid', '==', userUid)
                            .where('couponId','==',coupon[0].id).get()).docs.map(doc => doc.data());

    if (ticketsPerUser && ticketsPerUser.length > 0){
        //El usuario ya tiene un ticket de este cupon
        return {success:false, msg:"El usuario ya tiene un cupon activo"}
    }

    //Si llego aqui es porque puedo darle el cupon al usuario.
    //1. Verifico si el codigo es estatico o dinamico
    
    let code = ""
    if (coupon[0].couponType === 'estatico') { 
        //Uso el codigo del coupon
        code = coupon[0].code
    } else {
        //Genero un codigo unico
        code = Math.random().toString(30).substring(2); 
    }

    const ticket = {
        code: code,
        startDate : startDate,
        endDate: endDate,
        benefitId: benefitId,
        couponId: coupon[0].id,
        userUid:userUid,
        dateCreated: today,
        benefitTitle: benefit.title
    }

    //guardo la informacion en firestore en una coleccion de tickets
    await db.collection('tickets').doc().create(ticket)
    
    //envio el correo con el cupon
    const emailResponse = await sendEmail("jose.romero@lineadgroup.com",[userEmail],generateCuponHtml(userEmail,benefit.title,code,startDate.toString(),endDate.toString()) ,`Cupon ${benefit.title}`)

    if (!emailResponse){
        return {success:false,data:{msj:"no se pudo enviar el email"}}
    }

    return {success:true,data:ticket};
}

export const sendEmail = async (from:string,to:string[],html:string, subject:string) => {
    try {
        const mail: SendGridMail = {
            from,
            to,
            subject: subject,
            html: html,
        };
        
        await SendEmail(mail)
        return true
    }catch(e) {
        return false
    }
}

const generateCuponHtml = (userEmail:string,title:string,code:string,starDate:string,endDate:string) => {
    return `
        <div>
            <p>Hola ${userEmail}, has obtenido un cupon para ${title}</p>
            <p>Información de tú cupon</p>
            <ul>
                <li>Código: ${code}</li>
                <li>Este cupon es valido del ${starDate} hasta ${endDate}</li>
            </ul>
        </div>
    `
}