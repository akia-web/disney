import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }

})

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
    await transporter.sendMail({
        from: `"ddv-akia" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Pour réinitialiser votre mot de passe, cliquez sur ce lien : ${resetUrl}`,
        html: `
      <h2>Réinitialisation du mot de passe</h2>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
      </p>
      <p>Ce lien expirera dans 30 minutes.</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
      `
    })
}
