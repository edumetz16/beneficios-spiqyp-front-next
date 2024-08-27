import sgMail from '@sendgrid/mail';

export const SendEmail = async (params:any) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    return sgMail.send(params);
}