import client from "@/lib/mongo";
import { Resend } from "resend";
import crypto from "crypto"
import { Wallet } from "ethers";
import { nanoid } from 'nanoid';
import { createAuthEmailTemplate } from "@/lib/email";

const resend = new Resend(`${process.env.RESEND_API}`);

export async function POST(req: Request) {
  const link = `${process.env.LINK}/verify`
  const code = process.env.ENV === "development" ? "111111" : crypto.randomBytes(3).toString('hex').toLowerCase();

  try {
    const  { email } = await req.json();
    
    if(email === "" || !email) throw new Error("Email is required")
    
    const db = client.db(`${process.env.DATABASE}`);
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const authResult = await db.collection("auth").findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { email: email.toLowerCase(), expires, code  } },
      { upsert: true, returnDocument: "after" },
    );
    
    //@ts-expect-error: response not assign an interface / type
    const uuid = authResult._id;

    const wallet = Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const mnemonic = wallet.mnemonic;
    const address = await wallet.getAddress();
    const userID = nanoid();
    
    const response = await db.collection("user").findOneAndUpdate(
      { 
        email: email.toLowerCase() 
      },
      {
        $set: {
          auth: uuid,
          updatedAt: new Date(),
        },
        $setOnInsert: { 
          userID,
          name: null,
          phoneNumber: null,
          email: email.toLowerCase(), 
          type: "admin",
          createdAt: new Date(),
        }
      },
      {
        upsert: true,
        returnDocument: "after" 
      }
    );

    await db.collection("business").findOneAndUpdate(
      { 
        userID: response?.userID
      },
      {
        $setOnInsert: {
          businessID: nanoid(),
          userID: response?.userID,
          privateKey, 
          address,
          mnemonic,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      },
      { 
        upsert: true, 
        returnDocument: "after" 
      }
    ); 

    if(process.env.ENV === "development" ) return Response.json({});

    const emailTemplate = createAuthEmailTemplate(
      {
        code,
        link,
        expirationMinutes: 10,
      }
    )

    const { error } = await resend.emails.send({
      from: 'Custard <no-reply@abakcus.xyz>',
      to: [email],
      subject: 'Custard: Auth',
      html: emailTemplate,
    });
    
    if (error) {
      console.log(error)
      throw new Error(`Email sending error: ${error}`);
    }
    
    return Response.json({});
  } catch (error) {
    return Response.json({ error: `${error}` });
  } finally {
    console.log("Done: updating business")
  }
};