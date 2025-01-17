// app.js 
import 'dotenv/config'
import express from 'express'
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'
import { v4 as uuidv4 } from 'uuid'


import { sendMyMail } from './lib/mail.mjs'



const prisma = new PrismaClient();
const app = express();
const codes = {};


/////////////////////// MIDDLEWARES /////////////////////////

app.use(express.json())
app.use(cookieParser())



app.post('/auth/create_connexion', async (req, res) => {
    const {email,password} = req.body                              // Récupération des données du formulaire
    let user = await prisma.user.findUnique
    ({where: {email}})                                          // Recherche de l'utilisateur par e-mail

    if (user) { 
    // Vérification du mot de passe
    const match = await bcrypt.compare(password,user.password)

    if (match) {
    // Génération d'un code de vérification aléatoire
        const verificationCode = Math.floor(1000 + Math.random()* 9000)+ ""
        codes[email] = verificationCode                                  // Stockage du code associé à l'e-mail

    // Envoi du code de vérification par e-mail
    await sendMyMail({
        from: process.env.MAIL_SENDER,
        to: email,
        subject:'code de vérification Securit',
        text: ` le code de vérification est : ${verificationCode}`
    })

    // Création d'un cookie de vérification
    res.cookie('delay', "time", { httpOnly: true, maxAge: 1601000 })
    res.sendStatus(200);

    } else {
    // Si le mot de passe est incorrecte, affiche un message d'erreur sur la page de connexion
        res.sendStatus(403);
    }

    } else {
    // Si l'e-mail n'est pas trouvé dans la base de données, afficher un message d'erreur sur la page de connexion
        res.sendStatus(403)
    }
    })


app.post('/auth/verify_code', (req,res) =>{
   const {email, code} = req.body;
   if (code === codes[email]) {
      const cookie = req.cookies['delay']
      if (cookie !== "time") {
         res.sendStatus(403);

      } else {
         let myuuid = uuidv4();
         res.cookie("session_id", myuuid, {httpOnly: true, maxAge: 1 * 60 * 1000})
         res.sendStatus(200);
      }
   } else {
      res.render(400);
   }
})



app.post('/auth/create_account', async (req, res) => {
   const { email, password, password2 } = req.body
   if (password === password2) {
      const existingUser = await prisma.user.findUnique({
         where: { email }
      })
      console.log('existingUser', existingUser);
      
      if (existingUser) {
         res.sendStatus(400)
      } else {
         const hashedPassword = await bcrypt.hash(password, 3)
         const createUser = await prisma.user.create ({
            data : {email, password: hashedPassword}
         })
         res.sendStatus(200);
      }
   } else {
      res.sendStatus(403)
   }
})


// app.get('/confirmCreate', (req, res) => {
//    res.render('confirmCreate')
// })


app.use('/assets', express.static('./assets'))


// app.use('/', (req, res, next) => {
//    if (req.cookies.session_id) {
//       next()
//    } else {
//       res.render('login', {errorMessage: "Session expirée"})
//    }
// })
// //////////////////////AUTHENTIFICATION///////////////////////

app.get("/api/visit", async (req, res) => {
   const visitData = await prisma.visit.findMany({
     include: {
       company: true,
     },
   });
   res.send(visitData);
 });

app.post('/api/create_visit', async (req, res) => {
   const { date, companyName, report } = req.body;

   if (!date || !companyName || !report) {
      return res.sendStatus(400)
   } else {
      const company = await prisma.company.findUnique({
         where: { companyName },
      });
      const createVisit = await prisma.visit.create ({
         data : {date, companyName, report}
      })
      res.sendStatus(200);
      }})



// app.get('/newVisit', async (req,res) => {
//    const company_list = await prisma.company.findMany();
//    res.render('newVisit', {companies: company_list, errorMessage:""});
// });

////////////////////////////////////////////////////////////


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
   console.log(`Server listening on port http://localhost:${PORT}`)
})